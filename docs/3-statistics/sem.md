---
title: 3.7 SEM / PLS-SEM
description: 结构方程模型的测量、结构、识别与拟合评估
---

# 3.7 SEM / PLS-SEM

::: tip 本节目标
读完本节后，你能把潜变量测量模型与结构路径分开，判断模型是否可识别，选择与变量类型匹配的估计量，结合参数与整体拟合诊断模型，并说明协方差型 SEM 与 PLS-SEM 的不同目标和边界。
:::

## SEM 回答什么问题

**结构方程模型**（SEM）把测量模型和变量间结构关系放在同一框架中：测量模型说明题目如何反映潜变量，结构模型说明潜变量或观测变量之间的条件关系。它适合检验事先提出的联合模型、显式建模测量误差和比较受约束模型；它不会仅凭路径方向把横断面关联变成因果关系。

数据通常是一行一个独立抽样单位、列为题目或观测变量。重复测量、家庭/班级嵌套、类别变量和复杂抽样需要相应的纵向、多层、类别变量或调查设计 SEM，不能忽略观测结构。

## 先做测量模型，再解释结构路径

单因子确认性因子模型可写为：

$$
\mathbf{x}=\boldsymbol{\nu}+\boldsymbol{\Lambda}\eta+\boldsymbol{\epsilon},
$$

其中 $\boldsymbol{\Lambda}$ 是因子载荷，$\eta$ 是潜变量，$\boldsymbol{\epsilon}$ 是测量误差。结构部分常写为：

$$
\boldsymbol{\eta}=\boldsymbol{\alpha}+\mathbf{B}\boldsymbol{\eta}+\boldsymbol{\Gamma}\mathbf{x}+\boldsymbol{\zeta}.
$$

先检查题目方向、缺失、分布、载荷、残差和区分效度，再解释结构系数。高内部一致性不能代替单维性检验；若跨群体或跨时间比较潜均值和路径，还应依据比较目标检验测量不变性。

## 识别、估计与拟合

### 识别

模型必须有足够信息唯一估计参数。潜变量需设定尺度，例如固定一个载荷为 1 或固定因子方差；自由参数数目、指标数量、误差相关和反馈路径都会影响识别。自由度大于 0 只是必要线索，不保证实质上识别良好。负方差、极大标准误、相关接近 $\pm1$ 或不收敛都可能提示模型设定或识别问题。

### 估计量

- 连续且近似多元正态的指标常用 ML；偏态或异方差时可用稳健 ML，并报告具体估计量。
- 有序分类题目通常按其类别数、分布与软件实现选择适合有序变量的估计量（如 WLSMV），而不是默认把 Likert 题当连续正态变量。
- 缺失数据可在明确的缺失机制与模型假设下使用 FIML 或多重插补；列表删除并非中性选择。

### 不要用单一阈值“判生死”

$\chi^2$ 检验评估精确拟合，但对样本量和偏离程度敏感。CFI/TLI、RMSEA（含 CI）和 SRMR 从不同角度概括失配；常见 cutoff 是情境相关的经验规则，不是普适定律。应同时查看参数是否合理、标准化残差、局部失配、理论可解释性和替代模型。修改指数只定位在当前模型下可能的改动，不是自动加误差相关的指令；数据驱动修改应交叉验证并透明报告。

## 参数、效应量与不确定性

报告非标准化估计、SE 或 95% CI、标准化估计（注明标准化方式）、潜变量方差/协方差和残差方差。间接效应应直接给乘积及其 bootstrap 或稳健区间；组间比较应说明不变性约束。$R^2$ 可描述内生变量在模型内的解释比例，但不证明因果机制，也不保证样本外预测。

样本量不能由固定的“每个参数 N 人”规则决定。模型复杂度、载荷、变量分布、缺失、估计量和目标效应都会影响功效与收敛；优先用与拟议模型一致的 Monte Carlo 模拟，并报告参数依据和失败率。

## 协方差型 SEM 与 PLS-SEM

本页主体是**协方差型 SEM**（CB-SEM），目标是估计模型隐含协方差结构并检验整体模型。**PLS-SEM**以成分和预测为核心，算法、目标函数与拟合概念不同；不能因为样本小、模型复杂或 CB-SEM 拟合不佳就自动改用 PLS-SEM。若选择 PLS-SEM，应事先说明预测目标、构念是反映式还是形成式、验证策略，并报告样本外预测表现。两类结果的载荷、路径和“拟合”不应直接当作等价证据。

::: warning 常见误用
不要在同一数据上反复加路径直到 CFI 达标，不要以路径显著代替测量质量，也不要把箭头方向当作因果识别。等价或近等价模型可能产生相同或相似的协方差拟合；时间顺序、随机化、无未测混杂等证据来自研究设计，而不是 SEM 图本身。
:::

## 教学示例：先写模型，再看输出

下面是一个三指标测量“归属感”、再用实验条件预测该潜变量的**教学模型模板**。`x1` 至 `x3` 为题目，`condition` 为事先编码的实验条件。

```r
# lavaan 0.6-20（核查于 2026-08-14）
library(lavaan)

model <- '
  belonging =~ x1 + x2 + x3
  belonging ~ condition
'

fit <- sem(
  model,
  data = dat,
  estimator = "MLR",
  missing = "fiml"
)

summary(fit, fit.measures = TRUE, standardized = TRUE, rsquare = TRUE)
resid(fit, type = "cor")
```

这是需要真实数据 `dat` 才能运行的模板，本次没有虚构输出。分析时应核对题目编码和估计量适配性，并记录 `lavaan` 版本；报告 $\chi^2(df)$、CFI/TLI、RMSEA 及 CI、SRMR、载荷与结构路径的估计和 CI，同时检查异常估计和标准化残差。

## 工作流程

1. 根据理论画出模型，列出每个构念的指标、方向、尺度和时间点。
2. 检查数据质量、缺失、分布、抽样单位和题目类别；选择估计量。
3. 确认尺度设定与识别，先评估测量模型，再检验结构假设。
4. 同时查看全局拟合、局部残差、参数合理性、效应量和不确定性。
5. 将探索性修改与验证性检验分开；对关键替代模型和识别假设做敏感性分析。

## 资源与工具

<ResourceGrid :min="200">
  <ResourceCard
    name="lavaan"
    desc="R 中 CFA、路径分析与 SEM 官方教程（0.6-20）"
    href="https://lavaan.ugent.be/tutorial/"
    icon="🧱"
  />
  <ResourceCard
    name="semTools"
    desc="测量不变性、信度与 SEM 辅助工具"
    href="https://cran.r-project.org/package=semTools"
    icon="🧰"
  />
</ResourceGrid>

## 延伸阅读

- Bollen, K. A. (1989). *Structural equations with latent variables*. Wiley. https://doi.org/10.1002/9781118619179
- Hu, L., & Bentler, P. M. (1999). Cutoff criteria for fit indexes in covariance structure analysis: Conventional criteria versus new alternatives. *Structural Equation Modeling, 6*(1), 1–55. https://doi.org/10.1080/10705519909540118
- Marsh, H. W., Hau, K.-T., & Wen, Z. (2004). In search of golden rules: Comment on hypothesis-testing approaches to setting cutoff values for fit indexes and dangers in overgeneralizing Hu and Bentler's findings. *Structural Equation Modeling, 11*(3), 320–341. https://doi.org/10.1207/S15328007SEM1103_2
- Cheung, G. W., & Rensvold, R. B. (2002). Evaluating goodness-of-fit indexes for testing measurement invariance. *Structural Equation Modeling, 9*(2), 233–255. https://doi.org/10.1207/S15328007SEM0902_5
