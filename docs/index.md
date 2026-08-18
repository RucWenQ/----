---
layout: home

hero:
  name: 明德惟心の简明教程
  text: 学习&科研入门
  tagline: 希望大家顺利毕业：）
  actions:
    - theme: brand
      text: 初次阅读
      link: /0-introduction/
    - theme: alt
      text: 科研工具
      link: /1-tools/
    - theme: alt
      text: 论文写作
      link: /7-writing/

features:
  - icon: 🌱
    title: 从零开始
    details: 0 → 1 → 2 → 3 → 4 → 5 → 6 → 7 。从零开始，按部就班。
    link: /0-introduction/learning-paths
    linkText: 查看学习路径
  - icon: ⚙️
    title: 随时查用
    details: 1 & 3 & 4 中你需要的小节。随时看小抄，补足科研能力。
    link: /1-tools/
    linkText: 进入工具章
  - icon: 📑
    title: 论文冲刺
    details: 6 → 2 → 3 → 4 → 7 。要交毕业论文/投稿了？快抱抱佛脚吧~
    link: /7-writing/
    linkText: 进入写作章
---

## 章节导览

<ResourceGrid :min="200">
  <ResourceCard name="0 · 引言" desc="教程简介 · 学习路径" href="/0-introduction/" icon="📖" />
  <ResourceCard name="1 · 科研工具" desc="文献 · Zotero · 统计软件 · AI" href="/1-tools/" icon="🛠️" />
  <ResourceCard name="2 · 研究设计" desc="测量 · 功效 · 预注册 · 伦理" href="/2-design/" icon="📐" />
  <ResourceCard name="3 · 统计" desc="基础 · 回归 · 中介调节 · 多层" href="/3-statistics/" icon="📊" />
  <ResourceCard name="4 · 科研作图" desc="ggplot · seaborn · 投稿级细节" href="/4-visualization/" icon="🎨" />
  <ResourceCard name="5 · 研究方法" desc="vignette · 实验 · 纵向 · 二元" href="/5-methods/" icon="🔬" />
  <ResourceCard name="6 · 选题" desc="灵感 · 评估 · 操作化" href="/6-topic/" icon="💡" />
  <ResourceCard name="7 · 论文写作" desc="IMRD · 投稿 · 审稿回复" href="/7-writing/" icon="✍️" />
</ResourceGrid>

## 关于本教程

这是一份给师弟师妹的工具书：你可以从头到尾读一遍当作入门，也可以在某个具体的卡点查询。它**不替代教材**，而是一个尽可能高效的**百科**。

::: tip 快捷入口

→ [变量类型 → 分析方法对照表](/3-statistics/foundations#method-lookup)：不确定该用什么统计方法？查这张表。
:::

<!-- ## 关于复现危机

你大概率听过 Bem (2011) 的预知能力研究、Stapel 数据造假、社会启动效应的复现失败。这些不是边角八卦，它们重塑了过去十年社会心理学的研究规范。本教程的所有统计、设计章节都默认采用「可重复研究」的范式——你看到的代码与做法，是按照能够被同行直接复跑的标准来写的。

→ [详见 0.4 复现危机与开放科学](/0-introduction/open-science) -->
