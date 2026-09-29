import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";

const emptyIndex = {
  uploads: [],
  runs: [],
  reports: [],
  ideas: [],
};

async function readJson(file, fallback) {
  try {
    return JSON.parse(await readFile(file, "utf8"));
  } catch (error) {
    if (error.code === "ENOENT") return fallback;
    throw error;
  }
}

async function writeJsonAtomic(file, value) {
  const tmp = `${file}.${process.pid}.tmp`;
  await writeFile(tmp, `${JSON.stringify(value, null, 2)}\n`, "utf8");
  await rename(tmp, file);
}

export async function createStorage(root) {
  const dirs = {
    root,
    uploads: path.join(root, "uploads"),
    outputs: path.join(root, "outputs"),
    index: path.join(root, "index.json"),
  };
  await Promise.all([
    mkdir(dirs.uploads, { recursive: true }),
    mkdir(dirs.outputs, { recursive: true }),
  ]);
  const index = await readJson(dirs.index, emptyIndex);
  for (const key of Object.keys(emptyIndex)) index[key] ??= [];

  async function persist() {
    await writeJsonAtomic(dirs.index, index);
  }

  return {
    async saveUpload({ filename, buffer, mimeType }) {
      const id = randomUUID();
      const safe = filename.replace(/[^a-zA-Z0-9._-]/g, "_").slice(-120) || "paper.pdf";
      const storageName = `${id}-${safe}`;
      await writeFile(path.join(dirs.uploads, storageName), buffer);
      const upload = {
        id,
        filename: safe,
        mimeType,
        bytes: buffer.byteLength,
        storageName,
        createdAt: new Date().toISOString(),
      };
      index.uploads.unshift(upload);
      await persist();
      return upload;
    },

    async readUpload(id) {
      const upload = index.uploads.find((item) => item.id === id);
      if (!upload) return null;
      const buffer = await readFile(path.join(dirs.uploads, upload.storageName));
      return { ...upload, buffer };
    },

    async saveRun(run) {
      const existing = index.runs.findIndex((item) => item.id === run.id);
      if (existing >= 0) index.runs[existing] = { ...index.runs[existing], ...run };
      else index.runs.unshift(run);
      await persist();
      return index.runs.find((item) => item.id === run.id);
    },

    readRun(id) {
      return index.runs.find((item) => item.id === id) ?? null;
    },

    async saveReport(report) {
      const existing = index.reports.findIndex((item) => item.id === report.id);
      if (existing >= 0) index.reports[existing] = { ...index.reports[existing], ...report };
      else index.reports.unshift(report);
      await writeJsonAtomic(path.join(dirs.outputs, `${report.id}.json`), report.json);
      await writeFile(path.join(dirs.outputs, `${report.id}.md`), report.markdown, "utf8");
      await persist();
      return report;
    },

    readReport(id) {
      return index.reports.find((item) => item.id === id) ?? null;
    },

    listLibrary() {
      return index.reports.map((report) => ({ ...report }));
    },

    async createIdea({ title = "未命名研究想法" } = {}) {
      const idea = {
        id: randomUUID(),
        title,
        stage: "framing",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        messages: [],
        revisions: [],
        state: {
          stage: "framing",
          question: { one_sentence: "", novelty_status: "not_assessed" },
          constructs: [],
          hypotheses: [],
          evidence_claims: [],
          open_questions: ["你真正想知道的未知是什么？"],
          risks: [],
          next_action: "把兴趣点写成一个具体问题。",
        },
      };
      index.ideas.unshift(idea);
      await persist();
      return idea;
    },

    readIdea(id) {
      return index.ideas.find((item) => item.id === id) ?? null;
    },

    async addIdeaMessage(id, message, state) {
      const idea = index.ideas.find((item) => item.id === id);
      if (!idea) return null;
      idea.messages.push(message);
      idea.state = state;
      idea.stage = state.stage;
      idea.updatedAt = new Date().toISOString();
      idea.revisions.unshift({
        id: randomUUID(),
        revision: idea.revisions.length + 1,
        createdAt: idea.updatedAt,
        state,
      });
      await persist();
      return idea;
    },

    async saveIdea(idea) {
      const existing = index.ideas.findIndex((item) => item.id === idea.id);
      if (existing < 0) return null;
      index.ideas[existing] = idea;
      await persist();
      return idea;
    },

    listIdeaRevisions(id) {
      return index.ideas.find((item) => item.id === id)?.revisions ?? [];
    },

    paths: dirs,
  };
}
