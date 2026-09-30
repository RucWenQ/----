import assert from "node:assert/strict";
import { runIdeaRefiner, runPaperReview } from "./skill-runner.mjs";

const calls = [];
const fakeClient = {
  async createResponse(request) {
    calls.push(request);
    if (request.kind === "paper") {
      return {
        schema_version: "1.0",
        document: { title_original: "Trust in AI", title_zh: "AI 信任", authors: [], year: null, journal: null, doi: null, page_count: 2 },
        processing: { scope: "full_text", extraction_method: "text", unreadable_pages: [], warnings: [], status: "complete" },
        summary: { article_type: "实证研究", research_question: "AI 信任如何形成？", theories: [], hypotheses: [], studies: [], authors_conclusion: "存在关联", authors_limitations: [] },
        context: { research_lineage: [], review_assessment: "证据有限", external_sources: [] },
        extension_ideas: [], evidence_ledger: [], tags: ["AI trust"],
      };
    }
    return {
      schema_version: "1.0", idea_id: request.idea.id, revision: request.idea.revisions.length + 1,
      updated_at: new Date().toISOString(), skill: { name: "psych-idea-refiner", version: "3.0.0" }, stage: "constructs",
      question: { one_sentence: request.userMessage, novelty_status: "not_assessed" }, evidence_claims: [], constructs: [], causal_model: {}, hypotheses: [], design: {}, open_science: {}, ethics: {}, contribution: {}, decisions: [], open_questions: ["核心构念是什么？"], risks: [], next_action: "定义构念",
      assistant: "请先定义核心构念。",
    };
  },
};

const report = await runPaperReview({
  upload: { id: "upload-1", filename: "trust-ai.pdf", buffer: Buffer.from("pdf"), mimeType: "application/pdf" },
  runId: "run-1",
  client: fakeClient,
});
assert.equal(report.json.report_id, "run-1");
assert.equal(report.json.skill.mode, "openai");
assert.match(report.markdown, /AI 信任/);
assert.equal(calls[0].kind, "paper");
assert.equal(calls[0].upload.filename, "trust-ai.pdf");

const idea = await runIdeaRefiner({
  idea: { id: "idea-1", revisions: [], state: { stage: "framing", question: {}, constructs: [] } },
  userMessage: "我想研究人们为什么信任 AI",
  client: fakeClient,
});
assert.equal(idea.state.schema_version, "1.0");
assert.equal(idea.state.question.one_sentence, "我想研究人们为什么信任 AI");
assert.equal(idea.assistant, "请先定义核心构念。");
assert.equal(calls[1].kind, "idea");

console.log("real skill runner contract test passed");
