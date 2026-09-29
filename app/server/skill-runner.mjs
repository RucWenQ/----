function paperTitle(filename) {
  return filename.replace(/\.pdf$/i, "").replace(/[_-]+/g, " ").trim() || "待识别论文";
}

export async function runPaperReview({ upload, runId }) {
  const title = paperTitle(upload.filename);
  const json = {
    schema_version: "1.0",
    report_id: runId,
    generated_at: new Date().toISOString(),
    skill: { name: "psychology-paper-review", version: "3.0.0", mode: "demo" },
    document: {
      title_original: title,
      title_zh: title,
      authors: [],
      year: null,
      journal: null,
      doi: null,
      source_filename: upload.filename,
      page_count: null,
    },
    processing: {
      scope: "full_text",
      extraction_method: "pending-model-adapter",
      unreadable_pages: [],
      warnings: ["当前为演示 runner，尚未调用真实论文解析与模型。"],
      status: "partial",
    },
    summary: {
      article_type: "待识别",
      research_question: "上传完成后由论文精读 skill 提取。",
      theories: [],
      hypotheses: [],
      studies: [],
      authors_conclusion: "待真实 skill runner 处理。",
      authors_limitations: [],
    },
    context: { research_lineage: [], review_assessment: "演示报告", external_sources: [] },
    extension_ideas: [],
    evidence_ledger: [],
    tags: ["待处理", "演示报告"],
  };
  const markdown = `# 心理学论文 Review Report：${title}\n\n**原文**：${upload.filename}\n**报告范围**：演示报告\n\n> 文件已进入知识库工作流。当前服务使用 demo runner；配置真实 skill runner 后会生成带页码证据的完整报告。\n\n## 一、文献总结\n\n论文文件已上传，等待真实解析与精读 skill。\n\n## 二、相关内容梳理\n\n研究脉络和综合评述将在真实 runner 中生成。\n\n## 三、拓展研究\n\n当前没有根据论文内容生成拓展研究，避免在未读取全文时臆测。\n\n## 四、证据与待核实项\n\n- 文件：\`${upload.filename}\`\n- 当前状态：partial\n- 处理模式：demo runner\n`;
  return { json, markdown };
}

export async function runIdeaRefiner({ idea, userMessage }) {
  const text = userMessage.trim();
  const current = idea.state;
  const hasIdea = text.length > 0;
  const state = {
    ...current,
    stage: hasIdea ? "constructs" : current.stage,
    question: {
      ...current.question,
      one_sentence: hasIdea ? text : current.question.one_sentence,
      novelty_status: "not_assessed",
    },
    open_questions: hasIdea
      ? ["这个问题中的核心构念分别是什么？", "什么结果会让你放弃当前假设？"]
      : current.open_questions,
    next_action: hasIdea ? "先定义核心构念，再决定如何测量。" : current.next_action,
    risks: hasIdea ? ["当前只记录了想法，尚未核验理论和文献证据。"] : current.risks,
  };
  const assistant = hasIdea
    ? `我先把你的输入记录为当前研究问题：\n\n> ${text}\n\n现在先处理构念层。你说的核心构念分别是什么？每个构念准备怎样定义和测量？`
    : "请先写下你现在最想研究的现象或问题。";
  return { state, assistant };
}
