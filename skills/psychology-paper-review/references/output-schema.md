# 结构化输出契约

在应用、批处理或知识库场景中，除 Markdown 外生成 UTF-8 JSON。普通对话中除非用户要求，不必额外生成 JSON。

## 顶层结构

```json
{
  "schema_version": "1.0",
  "report_id": "stable-uuid",
  "generated_at": "ISO-8601",
  "skill": { "name": "psychology-paper-review", "version": "3.0.0" },
  "document": {},
  "processing": {},
  "summary": {},
  "context": {},
  "extension_ideas": [],
  "evidence_ledger": [],
  "tags": []
}
```

## 必要字段

### `document`

- `title_original`, `title_zh`
- `authors[]`, `year`, `journal`
- `doi`: 未确认时为 `null`，不得猜测
- `source_filename`, `file_hash`: 应用层可提供；skill 不自行虚构
- `page_count`

### `processing`

- `scope`: `full_text` 或 `abstract_only`
- `extraction_method`: `text`, `ocr`, `mixed` 或 `unknown`
- `unreadable_pages[]`
- `warnings[]`
- `status`: `complete`, `partial` 或 `failed`

### `summary`

- `article_type`
- `research_question`
- `theories[]`, `hypotheses[]`
- `studies[]`: 每项包含 `label`, `sample`, `design`, `variables`, `results`, `conclusion`, `pages[]`
- `authors_conclusion`, `authors_limitations[]`

### `context`

- `research_lineage[]`: 每项包含 `claim`, `sources[]`, `verification_status`
- `review_assessment`: 本报告的综合判断
- `external_sources[]`: 完整引用、DOI/URL、访问日期

### `extension_ideas[]`

每项包含 `title`, `question`, `gap_link`, `minimal_design`, `prediction`, `evidence_status`。`evidence_status` 只能是 `grounded`, `tentative`, `needs_search`。

### `evidence_ledger[]`

每项包含：

- `claim_id`
- `claim`
- `source_type`: `paper`, `external` 或 `reviewer_inference`
- `pages[]`: 对 PDF 原文使用印刷页或 PDF 页码；不可得时为空数组
- `locator`: 表格、图、章节或外部来源定位
- `confidence`: `high`, `medium`, `low`
- `note`

## 约束

- 使用 `null` 或空数组表示未知，不使用“待补充”字符串冒充数据。
- 数值字段保留原文单位；不能可靠解析时放入文本字段并加 warning。
- JSON 必须可被标准解析器解析，不能含 Markdown code fence 或注释。
- Markdown 与 JSON 的论文身份、研究数量和结论方向必须一致。
