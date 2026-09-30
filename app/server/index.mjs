import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { randomUUID } from "node:crypto";
import { createReadStream } from "node:fs";
import { mkdir, realpath, stat } from "node:fs/promises";
import { createStorage } from "./storage.mjs";
import { isModelConfigured, runIdeaRefiner, runPaperReview } from "./skill-runner.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const appRoot = path.resolve(here, "..", "..");
const dataRoot = path.join(appRoot, "data");
const webRoot = path.join(appRoot, "app", "web");
const maxUploadBytes = 25 * 1024 * 1024;

function json(res, status, payload) {
  res.writeHead(status, { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" });
  res.end(JSON.stringify(payload));
}

function fail(res, status, code, message) {
  json(res, status, { error: { code, message } });
}

async function bodyBuffer(req) {
  const chunks = [];
  let total = 0;
  for await (const chunk of req) {
    total += chunk.length;
    if (total > maxUploadBytes) throw Object.assign(new Error("上传文件超过 25 MB 限制"), { code: "PAYLOAD_TOO_LARGE" });
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
}

function multipart(buffer, contentType) {
  const match = contentType.match(/boundary=(?:"([^"]+)"|([^;]+))/i);
  if (!match) throw Object.assign(new Error("缺少 multipart boundary"), { code: "INVALID_MULTIPART" });
  const boundary = Buffer.from(`--${match[1] || match[2]}`);
  const parts = [];
  let offset = 0;
  while (true) {
    const start = buffer.indexOf(boundary, offset);
    if (start < 0) break;
    const bodyStart = buffer.indexOf(Buffer.from("\r\n\r\n"), start);
    if (bodyStart < 0) break;
    const end = buffer.indexOf(boundary, bodyStart + 4);
    if (end < 0) break;
    const headerText = buffer.subarray(start + boundary.length + 2, bodyStart).toString("utf8");
    const body = buffer.subarray(bodyStart + 4, Math.max(bodyStart + 4, end - 2));
    const disposition = headerText.match(/Content-Disposition: form-data;\s*name="([^"]+)"(?:;\s*filename="([^"]*)")?/i);
    if (disposition) parts.push({ name: disposition[1], filename: disposition[2], body, headerText });
    offset = end;
  }
  return parts;
}

async function readJsonBody(req) {
  const raw = await bodyBuffer(req);
  try { return JSON.parse(raw.toString("utf8") || "{}"); }
  catch { throw Object.assign(new Error("请求 JSON 无法解析"), { code: "INVALID_JSON" }); }
}

function contentTypeFor(file) {
  if (file.endsWith(".js")) return "text/javascript; charset=utf-8";
  if (file.endsWith(".css")) return "text/css; charset=utf-8";
  if (file.endsWith(".html")) return "text/html; charset=utf-8";
  return "application/octet-stream";
}

function ideaMarkdown(idea) {
  const state = idea.state || {};
  const constructs = (state.constructs || []).map((item) => `- ${item.name || item}: ${item.definition || "待定"}`).join("\n") || "- 待定";
  const risks = [...(state.risks || []), ...(state.open_questions || [])].map((item) => `- ${item}`).join("\n") || "- 暂无";
  return `# 研究 Idea Spec：${idea.title}\n\n**Idea ID**：${idea.id}\n**当前阶段**：${state.stage || "framing"}\n**证据状态**：${state.question?.novelty_status || "not_assessed"}\n\n## 研究问题\n\n${state.question?.one_sentence || "待明确"}\n\n## 核心构念与操作化\n\n${constructs}\n\n## 风险与未决问题\n\n${risks}\n\n## 下一步\n\n${state.next_action || "待定"}\n`;
}

export async function createServer({ dataRoot: root = dataRoot, runner = { runPaperReview, runIdeaRefiner } } = {}) {
  const storage = await createStorage(root);
  const tasks = new Map();
  const defaultRunner = runner.runPaperReview === runPaperReview && runner.runIdeaRefiner === runIdeaRefiner;

  async function runPaper(uploadId, runId) {
    const upload = await storage.readUpload(uploadId);
    await storage.saveRun({ id: runId, status: "processing", stage: "skill-runner", updatedAt: new Date().toISOString() });
    try {
      const output = await runner.runPaperReview({ upload, runId });
      await storage.saveReport({ id: runId, uploadId, createdAt: new Date().toISOString(), status: output.json.processing.status, filename: upload.filename, markdown: output.markdown, json: output.json });
      await storage.saveRun({ id: runId, status: "completed", stage: "archived", reportId: runId, updatedAt: new Date().toISOString() });
    } catch (error) {
      await storage.saveRun({ id: runId, status: "failed", stage: "skill-runner", error: error.message, updatedAt: new Date().toISOString() });
    } finally { tasks.delete(runId); }
  }

  const server = http.createServer(async (req, res) => {
    try {
      const url = new URL(req.url, `http://${req.headers.host || "localhost"}`);
      const pathname = url.pathname;
      if (req.method === "GET" && pathname === "/api/health") {
        const modelConfigured = !defaultRunner || isModelConfigured();
        return json(res, modelConfigured ? 200 : 503, { ok: modelConfigured, service: "research-workbench", model_configured: modelConfigured });
      }
      if (req.method === "GET" && pathname === "/api/library") return json(res, 200, { items: storage.listLibrary() });
      const runMatch = pathname.match(/^\/api\/runs\/([^/]+)$/);
      if (req.method === "GET" && runMatch) {
        const run = storage.readRun(runMatch[1]);
        return run ? json(res, 200, run) : fail(res, 404, "RUN_NOT_FOUND", "任务不存在");
      }
      const downloadMatch = pathname.match(/^\/api\/reports\/([^/]+)\/download$/);
      if (req.method === "GET" && downloadMatch) {
        const report = storage.readReport(downloadMatch[1]);
        if (!report) return fail(res, 404, "REPORT_NOT_FOUND", "报告不存在");
        const format = url.searchParams.get("format") === "json" ? "json" : "md";
        res.writeHead(200, { "content-type": format === "json" ? "application/json; charset=utf-8" : "text/markdown; charset=utf-8", "content-disposition": `attachment; filename="${report.id}.${format}"` });
        return res.end(format === "json" ? JSON.stringify(report.json, null, 2) : report.markdown);
      }
      if (req.method === "POST" && pathname === "/api/uploads") {
        const parts = multipart(await bodyBuffer(req), req.headers["content-type"] || "");
        const file = parts.find((part) => part.filename);
        if (!file || !file.filename.toLowerCase().endsWith(".pdf")) return fail(res, 400, "PDF_REQUIRED", "请选择 PDF 文件");
        const upload = await storage.saveUpload({ filename: file.filename, buffer: file.body, mimeType: "application/pdf" });
        const runId = randomUUID();
        await storage.saveRun({ id: runId, status: "queued", stage: "uploaded", uploadId: upload.id, filename: upload.filename, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
        tasks.set(runId, runPaper(upload.id, runId));
        return json(res, 202, { upload, runId });
      }
      if (req.method === "POST" && pathname === "/api/ideas") {
        const payload = await readJsonBody(req);
        return json(res, 201, await storage.createIdea({ title: payload.title }));
      }
      const ideaMatch = pathname.match(/^\/api\/ideas\/([^/]+)$/);
      if (req.method === "GET" && ideaMatch) {
        const idea = storage.readIdea(ideaMatch[1]);
        return idea ? json(res, 200, idea) : fail(res, 404, "IDEA_NOT_FOUND", "研究想法不存在");
      }
      const revisionsMatch = pathname.match(/^\/api\/ideas\/([^/]+)\/revisions$/);
      if (req.method === "GET" && revisionsMatch) {
        const idea = storage.readIdea(revisionsMatch[1]);
        return idea ? json(res, 200, { items: storage.listIdeaRevisions(revisionsMatch[1]) }) : fail(res, 404, "IDEA_NOT_FOUND", "研究想法不存在");
      }
      const exportIdeaMatch = pathname.match(/^\/api\/ideas\/([^/]+)\/export$/);
      if (req.method === "GET" && exportIdeaMatch) {
        const idea = storage.readIdea(exportIdeaMatch[1]);
        if (!idea) return fail(res, 404, "IDEA_NOT_FOUND", "研究想法不存在");
        const format = url.searchParams.get("format") === "json" ? "json" : "md";
        res.writeHead(200, { "content-type": format === "json" ? "application/json; charset=utf-8" : "text/markdown; charset=utf-8", "content-disposition": `attachment; filename="${idea.id}-idea-spec.${format}"` });
        return res.end(format === "json" ? JSON.stringify(idea.state, null, 2) : ideaMarkdown(idea));
      }
      const messageMatch = pathname.match(/^\/api\/ideas\/([^/]+)\/messages$/);
      if (req.method === "POST" && messageMatch) {
        const idea = storage.readIdea(messageMatch[1]);
        if (!idea) return fail(res, 404, "IDEA_NOT_FOUND", "研究想法不存在");
        const payload = await readJsonBody(req);
        const output = await runner.runIdeaRefiner({ idea, userMessage: String(payload.message || "") });
        const now = new Date().toISOString();
        const updated = await storage.addIdeaMessage(messageMatch[1], { role: "user", content: String(payload.message || ""), createdAt: now }, output.state);
        updated.messages.push({ role: "assistant", content: output.assistant, createdAt: new Date().toISOString() });
        await storage.saveIdea(updated);
        await storage.saveRun({ id: `idea-${updated.id}-${updated.revisions.length}`, status: "completed", stage: "idea-refiner", updatedAt: new Date().toISOString() });
        return json(res, 200, { ...updated, assistant: output.assistant });
      }
      if (req.method === "GET" && pathname === "/research/") {
        const file = path.join(webRoot, "research-workbench.html");
        res.writeHead(200, { "content-type": contentTypeFor(file) });
        return createReadStream(file).pipe(res);
      }
      if (req.method === "GET" && pathname.startsWith("/research/")) {
        const rel = pathname.slice("/research/".length) || "research-workbench.html";
        const file = path.resolve(webRoot, rel);
        const relative = path.relative(webRoot, file);
        if (relative.startsWith("..") || path.isAbsolute(relative)) return fail(res, 403, "FORBIDDEN", "禁止访问");
        try { await stat(file); } catch { return fail(res, 404, "NOT_FOUND", "资源不存在"); }
        res.writeHead(200, { "content-type": contentTypeFor(file) });
        return createReadStream(file).pipe(res);
      }
      return fail(res, 404, "NOT_FOUND", "接口或资源不存在");
    } catch (error) {
      const status = error.code === "PAYLOAD_TOO_LARGE" ? 413 : error.code === "INVALID_JSON" ? 400 : error.status || 500;
      return fail(res, status, error.code || "INTERNAL_ERROR", error.message || "服务器错误");
    }
  });
  server.storage = storage;
  server.tasks = tasks;
  return server;
}

if (process.argv[1] && await realpath(process.argv[1]) === await realpath(fileURLToPath(import.meta.url))) {
  await mkdir(dataRoot, { recursive: true });
  const port = Number(process.env.RESEARCH_PORT || 4174);
  const server = await createServer({});
  server.listen(port, "127.0.0.1", () => console.log(`Research workbench: http://127.0.0.1:${port}/research/`));
}
