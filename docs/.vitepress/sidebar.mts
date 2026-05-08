import type { DefaultTheme } from "vitepress";

/**
 * 侧边栏配置
 *
 * 维护规则：
 * 1. 每个章节是一个 key（路径前缀），对应 docs/x-xxx/ 文件夹
 * 2. 新增子页面时，在对应章节的 items 里加一行
 * 3. items[].link 用相对站点根的绝对路径，不带 .md 后缀
 * 4. collapsed: false = 默认展开，true = 默认折叠
 */
export const sidebar: DefaultTheme.Sidebar = {
  // ============== 首页根路径 ==============
  "/": [
    {
      text: "速通 · 简明教程",
      items: [
        { text: "关于本教程", link: "/" },
        { text: "更新日志", link: "/changelog" },
      ],
    },
  ],

  // ============== 0 · 引言 ==============
  "/0-introduction/": [
    {
      text: "0 · 引言",
      collapsed: false,
      items: [
        { text: "本章导读", link: "/0-introduction/" },
        { text: "0.1 手册目标", link: "/0-introduction/audience" },
        { text: "0.2 学习路径", link: "/0-introduction/learning-paths" },
      ],
    },
  ],

  // ============== 1 · 科研工具 ==============
  "/1-tools/": [
    {
      text: "1 · 科研工具",
      collapsed: false,
      items: [
        { text: "本章导读", link: "/1-tools/" },
        { text: "1.1 文献检索", link: "/1-tools/literature-search" },
        { text: "1.2 Zotero 全工作流", link: "/1-tools/zotero" },
        { text: "1.3 数据分析软件", link: "/1-tools/stats-software" },
        { text: "1.4 大模型与 AI 辅助", link: "/1-tools/ai-llm" },
        { text: "1.5 实验程序工具", link: "/1-tools/experiments" },
        { text: "1.6 项目管理与协作", link: "/1-tools/project-management" },
        { text: "1.7 网络与 VPN", link: "/1-tools/vpn" },
      ],
    },
  ],

  // ============== 2 · 研究设计 ==============
  "/2-design/": [
    {
      text: "2 · 研究设计",
      collapsed: false,
      items: [
        { text: "本章导读", link: "/2-design/" },
        { text: "2.1 研究问题与假设", link: "/2-design/question-hypothesis" },
        { text: "2.2 测量：信度·效度", link: "/2-design/measurement" },
        { text: "2.3 实验设计基础", link: "/2-design/experimental-design" },
        { text: "2.4 取样与功效分析", link: "/2-design/sampling-power" },
        { text: "2.5 预注册与开放科学", link: "/2-design/preregistration" },
        { text: "2.6 研究伦理", link: "/2-design/ethics" },
      ],
    },
  ],

  // ============== 3 · 统计 ==============
  "/3-statistics/": [
    {
      text: "3 · 统计",
      collapsed: false,
      items: [
        { text: "本章导读", link: "/3-statistics/" },
        { text: "3.0 基础概念", link: "/3-statistics/foundations" },
        { text: "3.1 描述性统计", link: "/3-statistics/descriptive" },
        { text: "3.2 差异分析", link: "/3-statistics/difference", items: [
          { text: "3.2.1 t 检验", link: "/3-statistics/t-test" },
          { text: "3.2.2 ANOVA", link: "/3-statistics/anova" },
          { text: "3.2.3 MANOVA", link: "/3-statistics/manova" },
        ] },
        { text: "3.3 卡方与列联表", link: "/3-statistics/chi-square" },
        { text: "3.4 回归分析", link: "/3-statistics/regression", items: [
          { text: "3.4.0 相关分析", link: "/3-statistics/correlation" },
          { text: "3.4.1 一元回归", link: "/3-statistics/simple-regression" },
          { text: "3.4.2 多元回归", link: "/3-statistics/multiple-regression" },
          { text: "3.4.3 哑变量回归", link: "/3-statistics/dummy-coding" },
        ] },
        { text: "3.5 中介与调节", link: "/3-statistics/mediation-moderation" },
        { text: "3.6 多层 / 混合效应模型", link: "/3-statistics/multilevel" },
        { text: "3.7 SEM / PLS-SEM", link: "/3-statistics/sem" },
        { text: "3.8 元分析", link: "/3-statistics/meta-analysis" },
        { text: "3.9 贝叶斯统计入门", link: "/3-statistics/bayesian" },
      ],
    },
  ],

  // ============== 4 · 科研作图 ==============
  "/4-visualization/": [
    {
      text: "4 · 科研作图",
      collapsed: false,
      items: [
        { text: "本章导读", link: "/4-visualization/" },
        { text: "4.1 图的语法（GoG）", link: "/4-visualization/grammar" },
        { text: "4.2 常用图谱", link: "/4-visualization/common-charts" },
        { text: "4.3 R · ggplot2", link: "/4-visualization/ggplot2" },
        { text: "4.4 Python · seaborn", link: "/4-visualization/seaborn" },
        {
          text: "4.5 投稿级图的细节",
          link: "/4-visualization/publication-quality",
        },
      ],
    },
  ],

  // ============== 5 · 研究方法 ==============
  "/5-methods/": [
    {
      text: "5 · 研究方法",
      collapsed: false,
      items: [
        { text: "本章导读", link: "/5-methods/" },
        { text: "5.1 情境问卷 / vignette", link: "/5-methods/vignette" },
        { text: "5.2 实验室实验", link: "/5-methods/lab-experiment" },
        { text: "5.3 现场实验", link: "/5-methods/field-experiment" },
        { text: "5.4 量表研究", link: "/5-methods/scale-research" },
        { text: "5.5 纵向 / 日记 / ESM", link: "/5-methods/longitudinal" },
        { text: "5.6 二元数据 / APIM", link: "/5-methods/dyadic" },
        { text: "5.7 质性方法概述", link: "/5-methods/qualitative" },
      ],
    },
  ],

  // ============== 6 · 选题 ==============
  "/6-topic/": [
    {
      text: "6 · 选题",
      collapsed: false,
      items: [
        { text: "本章导读", link: "/6-topic/" },
        { text: "6.1 灵感的来源", link: "/6-topic/inspiration" },
        { text: "6.2 评估题目的好坏", link: "/6-topic/evaluation" },
        { text: "6.3 从模糊到可执行", link: "/6-topic/operationalization" },
      ],
    },
  ],

  // ============== 7 · 论文写作 ==============
  "/7-writing/": [
    {
      text: "7 · 论文写作",
      collapsed: false,
      items: [
        { text: "本章导读", link: "/7-writing/" },
        { text: "7.1 文献综述写作", link: "/7-writing/literature-review" },
        { text: "7.2 IMRD 各部分要点", link: "/7-writing/imrd" },
        { text: "7.3 投稿策略", link: "/7-writing/submission" },
        { text: "7.4 审稿与回复", link: "/7-writing/peer-review" },
        { text: "7.5 排版与格式细节", link: "/7-writing/formatting" },
      ],
    },
  ],

  // ============== 附录 ==============
  "/appendix/": [
    {
      text: "附录",
      collapsed: false,
      items: [
        { text: "附录导读", link: "/appendix/" },
        { text: "A.1 推荐书单", link: "/appendix/books" },
        { text: "A.2 常用术语对照", link: "/appendix/glossary" },
        { text: "A.3 致谢", link: "/appendix/acknowledgements" },
      ],
    },
  ],
};
