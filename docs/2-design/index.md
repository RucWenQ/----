---
title: 2 · 研究设计
description: 章节导读
---

<ChapterCover
  meta="CHAPTER 2 — RESEARCH DESIGN"
  title="2 · 研究设计"
  quote="先想清楚要回答什么，再决定怎么测、怎么算。"
/>

## 本章导读

<OutlineCard title="本章六节">

- [**2.1 研究问题与假设**](./question-hypothesis) — 从理论到可检验命题
- [**2.2 测量：信度·效度·操纵检验**](./measurement) — 量表的可信赖性
- [**2.3 实验设计基础**](./experimental-design) — 随机化、对照、混杂控制
- [**2.4 取样与功效分析**](./sampling-power) — G*Power · pwr · simr
- [**2.5 预注册与开放科学**](./preregistration) — OSF · AsPredicted · Registered Reports
- [**2.6 研究伦理**](./ethics) — IRB · 知情同意 · 去标识化

</OutlineCard>

## 读完本章你能完成什么

- 把一个宽泛的兴趣改写成研究问题、可检验假设和明确的估计目标；
- 说明变量、观测单位、测量证据和操纵检查，而不是只列出量表名称；
- 在实验、调查、纵向或二元设计之间做选择，提前处理随机化、干扰、缺失和伦理风险；
- 分清**功效规划**（在给定备择假设下提高检验发现效应的机会）与**精度规划**（把置信区间控制在可接受宽度），并说明它们都不能修复取样偏差；
- 用功效/精度规划、预注册和版本化记录把“想做什么”变成可审计的方案；
- 在结果解释中区分设计支持的因果推论、关联推论和仍需额外证据的外推。

## 最短决策路径

1. 先读 [2.1 研究问题与假设](./question-hypothesis)，写出主要问题、变量和不做的推论。
2. 若涉及量表、行为指标或操纵，接着看 [2.2 测量](./measurement)，确认信度、效度、可比性和操纵检查。
3. 需要比较处理条件时读 [2.3 实验设计基础](./experimental-design)；需要观察变化、配对或现场实施时，把设计细节与 [5 · 研究方法](../5-methods/) 对照。只有在随机分配、时间顺序、干扰控制和测量实施等条件成立时，才把结果写成因果推论；调查或自然纵向资料通常仍应写“关联”或“预测”。
4. 在收集数据前用 [2.4 取样与功效分析](./sampling-power) 规划样本量、精度、聚类和流失，而不是事后用“显著”决定样本是否够。
5. 将主要假设、排除、模型和偏离记录在 [2.5 预注册与开放科学](./preregistration)，并用 [2.6 研究伦理](./ethics) 检查风险、同意、隐私和退出。

## 一页设计备忘录

在伦理审查路径确定、开始招募前，至少留下以下可复核字段：

| 字段 | 最小内容 |
| --- | --- |
| 研究问题/估计目标 | 主要比较、关联或变化，以及原始量尺上的解释 |
| 观测结构 | 谁被测量、测几次、是否配对/嵌套/重复；真正独立的分析单位和随机化单位是什么 |
| 测量与操纵 | 题目/指标、计分、版本、操纵检查和失败处理 |
| 样本与精度 | 取样框、纳排标准、目标效应或区间宽度、流失/设计效应余量 |
| 分析与偏离 | 主要模型、诊断、缺失和敏感性分析；事后变化如何记录 |
| 风险与开放 | 伦理审批、同意、去标识、访问权限、材料和数据共享边界 |

这些字段不是固定模板：如果研究是探索性的，标出探索范围；如果设计不能支持因果，就在方案和论文中使用“关联”“预测”等措辞。功效输入应写明主要检验、最小关注效应和损耗假设；精度输入应写明目标区间宽度或允许误差。遇到高风险人群、复杂依赖结构、测量不变性或无法解释的诊断，保留方案和原始记录并尽早寻求伦理/统计咨询。

## 主干资料与核查入口

本章的研究问题、因果边界和开放记录可先对照 Shadish、Cook 与 Campbell 的实验/准实验设计教材；统计推断的报告最低线可参考 APA 的统计推断指南。样本量与精度规划则以 Lakens 的方法文章为起点，再回到 [2.4 取样与功效分析](./sampling-power) 的计算步骤。以下链接和书目信息于 **2026-08-26** 核查：

<ResourceGrid :min="200">
  <ResourceCard
    name="APA statistical inference guidance"
    desc="心理学期刊统计推断与报告的权威指南"
    href="https://doi.org/10.1037/0003-066X.54.8.594"
    icon="📐"
  />
  <ResourceCard
    name="Sample Size Justification"
    desc="把最小关注效应、精度和样本量理由写清楚"
    href="https://doi.org/10.1525/collabra.33267"
    icon="🧮"
  />
</ResourceGrid>

## 延伸路线

- 具体资料和实施方法： [5 · 研究方法](../5-methods/)。
- 模型、效应量和不确定性： [3 · 统计](../3-statistics/)。
- 预处理、图表和可复现导出： [4 · 科研作图](../4-visualization/) 与 [1 · 科研工具](../1-tools/)。

## 延伸阅读

- Shadish, W. R., Cook, T. D., & Campbell, D. T. (2002). *Experimental and quasi-experimental designs for generalized causal inference*. Houghton Mifflin。
- Wilkinson, L., & APA Task Force on Statistical Inference. (1999). Statistical methods in psychology journals: Guidelines and explanations. *American Psychologist, 54*(8), 594–604. https://doi.org/10.1037/0003-066X.54.8.594
- Lakens, D. (2022). Sample size justification. *Collabra: Psychology, 8*(1), 33267. https://doi.org/10.1525/collabra.33267
