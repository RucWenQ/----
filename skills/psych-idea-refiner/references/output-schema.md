# 结构化输出契约

应用模式下，每轮对话返回完整状态 JSON；生成 spec 时把最终状态另存为 UTF-8 `.json`。

```json
{
  "schema_version": "1.0",
  "idea_id": "stable-uuid",
  "revision": 1,
  "updated_at": "ISO-8601",
  "skill": { "name": "psych-idea-refiner", "version": "3.0.0" },
  "stage": "framing",
  "question": {},
  "evidence_claims": [],
  "constructs": [],
  "causal_model": {},
  "hypotheses": [],
  "design": {},
  "open_science": {},
  "ethics": {},
  "contribution": {},
  "decisions": [],
  "open_questions": [],
  "risks": [],
  "next_action": ""
}
```

## 关键约束

- `stage` 只能是 `framing`, `constructs`, `causal_model`, `design`, `contribution`, `ready`。
- 每条 `evidence_claims` 包含 `claim`, `source_ids[]`, `status`, `note`。`status` 只能是 `verified`, `tentative`, `needs_search`, `contradicted`。
- `question.novelty_status` 只能是 `not_assessed`, `limited_search`, `systematic_search`，并记录检索范围和日期。
- 每个构念保存定义、邻近构念、操作化和测量证据，不只保存名称。
- 每个假设保存预测、可证伪结果、竞争解释和证据状态。
- 每个 decision 保存 `decision`, `rationale`, `source_ids[]`, `reversibility`。
- 未知值用 `null` 或空数组，不编造默认答案。
- 新一轮返回完整状态，并递增 `revision`；持久化层负责并发控制和历史版本。
- Markdown 与 JSON 的问题、假设、设计和下一步必须一致。
