import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { mkdtemp, rm, symlink } from "node:fs/promises";
import { createServer } from "./index.mjs";

const testRunner = {
  async runPaperReview({ runId, upload }) {
    return { json: { report_id: runId, processing: { status: "complete" }, skill: { mode: "test" }, document: { source_filename: upload.filename } }, markdown: "# test report" };
  },
  async runIdeaRefiner({ idea, userMessage }) {
    return { state: { ...idea.state, schema_version: "1.0", question: { one_sentence: userMessage }, stage: "constructs" }, assistant: "test assistant" };
  },
};

const root = await mkdtemp(path.join(os.tmpdir(), "research-workbench-"));
const server = await createServer({ dataRoot: root, runner: testRunner });
await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
const address = server.address();
const base = `http://127.0.0.1:${address.port}`;
const json = async (url, options) => {
  const response = await fetch(`${base}${url}`, options);
  const payload = await response.json();
  assert.ok(response.ok, `${url}: ${JSON.stringify(payload)}`);
  return payload;
};

try {
  assert.deepEqual(await json("/api/health"), { ok: true, service: "research-workbench", model_configured: true });
  const form = new FormData();
  form.append("paper", new Blob(["%PDF-1.4 demo"], { type: "application/pdf" }), "demo-paper.pdf");
  const upload = await json("/api/uploads", { method: "POST", body: form });
  let run;
  for (let attempt = 0; attempt < 20; attempt += 1) {
    run = await json(`/api/runs/${upload.runId}`);
    if (run.status === "completed") break;
    await new Promise((resolve) => setTimeout(resolve, 25));
  }
  assert.equal(run.status, "completed");
  const report = await json(`/api/reports/${upload.runId}/download?format=json`);
  assert.equal(report.report_id, upload.runId);
  assert.equal((await json("/api/library")).items.length, 1);

  const idea = await json("/api/ideas", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ title: "演示 idea" }) });
  const updated = await json(`/api/ideas/${idea.id}/messages`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ message: "我想研究人们如何判断一个 AI 是否值得信任" }) });
  assert.equal(updated.revisions.length, 1);
  assert.equal((await json(`/api/ideas/${idea.id}/revisions`)).items.length, 1);
  assert.equal((await json(`/api/ideas/${idea.id}`)).messages.length, 2);
  const ideaExport = await fetch(`${base}/api/ideas/${idea.id}/export?format=md`);
  assert.equal(ideaExport.status, 200);
  assert.match(await ideaExport.text(), /研究 Idea Spec/);

  const linkedServer = path.join(root, "linked-server");
  await symlink(path.dirname(fileURLToPath(import.meta.url)), linkedServer, process.platform === "win32" ? "junction" : "dir");
  const child = spawn(process.execPath, [path.join(linkedServer, "index.mjs")], {
    env: { ...process.env, RESEARCH_PORT: "0" },
    stdio: ["ignore", "pipe", "pipe"],
  });
  try {
    const startup = await Promise.race([
      new Promise((resolve) => child.stdout.once("data", (chunk) => resolve(chunk.toString()))),
      new Promise((resolve, reject) => child.once("exit", (code) => reject(new Error(`linked server exited before listening: ${code}`)))),
      new Promise((resolve, reject) => setTimeout(() => reject(new Error("linked server startup timed out")), 3000)),
    ]);
    assert.match(startup, /Research workbench:/);
  } finally {
    if (child.exitCode === null) {
      child.kill();
      await new Promise((resolve) => child.once("exit", resolve));
    }
  }
  console.log("research workbench smoke test passed");
} finally {
  await new Promise((resolve) => server.close(resolve));
  await rm(root, { recursive: true, force: true });
}
