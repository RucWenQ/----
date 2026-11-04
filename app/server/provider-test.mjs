import assert from "node:assert/strict";
import { extractPdfText, createLLMClient } from "./skill-runner.mjs";

assert.equal(createLLMClient({ provider: "qwen", apiKey: "test-key" }).config.baseUrl, "https://dashscope.aliyuncs.com/compatible-mode/v1");
assert.equal(createLLMClient({ provider: "deepseek", apiKey: "test-key" }).config.baseUrl, "https://api.deepseek.com/v1");
assert.throws(() => createLLMClient({ provider: "openai", apiKey: "test-key" }), /LLM_PROVIDER/);

let captured;
const client = createLLMClient({
  provider: "qwen",
  apiKey: "test-key",
  fetchImpl: async (url, options) => {
    captured = { url, options, body: JSON.parse(options.body) };
    return new Response(JSON.stringify({ choices: [{ message: { content: '{"answer":"ok"}' } }] }), { status: 200, headers: { "content-type": "application/json" } });
  },
});
assert.deepEqual(await client.completeJson({ system: "system", user: "user" }), { answer: "ok" });
assert.equal(captured.url, "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions");
assert.equal(captured.body.model, "qwen-plus");
assert.deepEqual(captured.body.response_format, { type: "json_object" });

const pdfText = await extractPdfText(Buffer.from("not a pdf"));
assert.equal(pdfText.status, "failed");
assert.ok(pdfText.warnings.length > 0);
console.log("provider adapter contract test passed");
