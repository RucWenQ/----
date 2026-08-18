---
title: 3.2.3 多元方差分析（MANOVA）
description: MANOVA 的适用场景、四种检验统计量、SPSS / Python 实现，以及为什么社心方向越来越倾向用 SEM 替代它
---

# 3.2.3 多元方差分析（MANOVA）

::: tip 本节目标

读完本节后你能：

- 分清 MANOVA 在 ANOVA 之上多解决了什么问题。
- 判断研究该用 MANOVA、ANOVA、还是 SEM。
- 使用 SPSS 或 Python 运行 MANOVA，并完成事后分析。

:::

<OutlineCard title="本节路线图">

- MANOVA 在做什么
- 什么时候真的有用
- 四种检验统计量速览
- 用之前要满足什么条件
- 一个简单例子（含 SPSS / Python 实现）
- 显著之后做什么
- 为什么应该考虑改用 SEM

</OutlineCard>

## 一、MANOVA 在做什么

ANOVA 一次只能检验**一个**连续 DV。MANOVA（Multivariate ANOVA）把**多个**连续 DV 同时放进一个分析，问的核心问题是：

> 几组人在 **多个 DV 组成的"向量"** 上是否存在整体差异？

直觉对比：你想知道三种治疗（CBT / 心理动力学 / 对照）的效果，测了三个 DV——焦虑、抑郁、压力。

- **三次 ANOVA**：分别看每个 DV，I 类错误率累计膨胀，且漏掉"DV 之间联动的模式"。
- **一次 MANOVA**：先问"三组在'焦虑+抑郁+压力'这个三维向量上整体是否不同"，再决定是否逐个 DV 追查。

::: tip MANOVA 不是"几次 ANOVA 拼起来"
MANOVA 检验的是**线性组合**——它会找到一个"DV 的加权和"使得组间差异最大化，然后看这个最优加权和是否显著。这意味着：<span class="kw">即使每个 DV 单独看都不显著，MANOVA 仍可能发现整体显著的多元模式</span>。反过来也可能——单 DV 显著但 MANOVA 不显著（说明显著的 DV 之间差异方向相互抵消）。
:::

## 二、什么时候真的有用

MANOVA 真正有用的场景，比教科书让你以为的少。三条判断标准：

**值得用的情形：**

- 多个 DV **理论上相关**、属于同一个构念群（如焦虑/抑郁/压力都属于负性情绪谱系）。
- 你关心的是**多元模式**本身，而不是任何一个 DV。
- 想用一个总检验严格控制多次 ANOVA 的 I 类错误率。

**不必用的情形：**

- 多个 DV **理论上无关**：分开做 ANOVA + Bonferroni 校正即可。
- DV 之间相关 > .80：高度冗余，先因子分析合并成单一指标。
- 多个 DV 之间有**理论因果结构**（如焦虑 → 抑郁 → 自我效能）→ 直接 SEM。
- 多层数据（学生嵌套于班级）→ 多元混合模型。

::: warning 一个被很多教材忽略的事实
社心方向越来越少用 MANOVA。原因：

- Box's M 检验过度敏感，几乎总是显著，让"假设满足"几乎不可能成立。
- MANOVA 的结论很难转化成读者能跟着走的故事。
- 想做的事情，**SEM 几乎都能做得更直接、更灵活**。

如果你的研究问题听起来像"几个 DV 一起怎么动"，先问自己能不能用 SEM 表达。MANOVA 在 21 世纪的合理位置：**SEM 不可行时的简化替代品**。
:::

## 三、四种检验统计量速览

MANOVA 输出会同时给四个统计量。它们换汤不换药——都在衡量"组间变异在总变异中的占比"，但路径不同。

| 统计量                 | 直觉                                                    | 何时优先                           |
| ---------------------- | ------------------------------------------------------- | ---------------------------------- |
| **Wilks' Λ**           | 类似 1 - R²：误差变异占总变异的比例（**值越小越显著**） | 经典默认，与 F 关系最直接          |
| **Pillai's Trace**     | 组间变异占总变异的比例（值越大越显著）                  | **方差-协方差矩阵不齐时最稳健** ⭐ |
| **Hotelling's T²**     | 组间/组内的"广义信噪比"                                 | 两组时与 Pillai 数学等价           |
| **Roy's Largest Root** | 只看最强那一个判别维度                                  | 差异集中在单一维度时；否则过于乐观 |

::: tip 一句话规则
**默认报 Pillai's Trace**——它在样本不平衡、协方差矩阵不齐时偏差最小。四个统计量结论一致时随便报哪个都行（一般跟 Wilks' Λ 报）；不一致时以 Pillai 为准。
:::

## 四、用之前要满足什么条件

1. **观测独立**——和 ANOVA 同款。
2. **多元正态**——每组里 DV 向量服从多元正态分布。Mardia's test 或单变量正态性检查（每个 DV 单独看）作为粗筛；样本量大时偏离不致命。
3. **方差-协方差矩阵齐性**（Box's M test）——ANOVA 方差齐性假设的多元推广。Box's M 极敏感，<span class="kw">p < .001 是常态，看到不要恐慌，转用 Pillai's Trace 即可</span>。
4. **DV 之间相关适度**——0.3–0.7 之间最适合 MANOVA。太低 → 不如分开 ANOVA；太高 → 信息冗余，先合并。
5. **样本量充足**——每组 _n_ > DV 数 + 20 是底线；否则协方差矩阵估计极不稳定，结果不可靠。

## 五、一个简单例子

### 研究设计

- **IV**：治疗类型（CBT / 心理动力学 / 对照），3 水平，每组 _n_ = 40。
- **DVs**：焦虑（GAD-7）、抑郁（PHQ-9）、压力（PSS-10）。

三个 DV 之间预期中等正相关（~0.5），都属于负性情绪谱系。理论预期：CBT 组在三个 DV 上**整体**表现优于其他两组。

### SPSS 实现

**菜单**：`Analyze → General Linear Model → Multivariate`

把三个 DV 都拖入 Dependent Variables；把 treatment 拖入 Fixed Factor(s)。Options 勾选 Estimates of effect size、Homogeneity tests。

**语法**：

```text
GLM anxiety depression stress BY treatment
  /METHOD=SSTYPE(3)
  /POSTHOC=treatment(TUKEY)
  /PRINT=ETASQ DESCRIPTIVE HOMOGENEITY
  /CRITERIA=ALPHA(.05)
  /DESIGN=treatment.
```

### Python 实现

::: code-group

```python [statsmodels]
from statsmodels.multivariate.manova import MANOVA

mv = MANOVA.from_formula(
    'anxiety + depression + stress ~ C(treatment)', data=df
)
print(mv.mv_test())
# 输出会同时给 Wilks' Λ、Pillai's Trace、Hotelling-Lawley、Roy's
```

```python [pingouin（辅助检查）]
import pingouin as pg

# 多元正态性
pg.multivariate_normality(df[['anxiety', 'depression', 'stress']])

# Box's M（协方差矩阵齐性）
pg.box_m(data=df, dvs=['anxiety', 'depression', 'stress'],
         group='treatment')
```

:::

::: warning Python 跑 MANOVA 的小坑

- statsmodels 的 `MANOVA` 不直接给 partial η²，需要从输出的 F 和 df 反算：
  $$\eta_p^2 = \frac{F \times df_{\text{num}}}{F \times df_{\text{num}} + df_{\text{den}}}$$
- 没有原生事后比较——要么手动跑各个 DV 的 ANOVA，要么换工具（R 的 `car::Manova`、SPSS GLM）。
  :::

## 六、显著之后做什么

MANOVA 显著只告诉你"组间在某种 DV 组合上有整体差异"。**它不告诉你**：是哪个 DV 在驱动这个差异，差异有多大方向如何。两条事后路径：

### 路径 A：分别做单因素 ANOVA + 校正（最常用）

对每个 DV 做单因素 ANOVA + Tukey HSD 事后比较，并用 **Bonferroni 校正**控制总 I 类错误：α = .05 / DV 数量。三个 DV 时，每个单 ANOVA 的判断阈值变成 α = .017。

简单、易解释，**99% 的论文都走这条路**。代价是丢失了 MANOVA 想保留的"多元信息"。

### 路径 B：判别函数分析（DFA）

寻找最能区分组别的 DV 线性组合，把多元差异降维到 1–2 个判别函数上解释。理论上更"忠于" MANOVA 的多元精神，但解释麻烦，很少有论文使用。

## 七、APA 报告模板

> 多元方差分析显示，治疗类型对心理健康的多元综合得分有显著影响，**Pillai's Trace = 0.184, _F_(6, 232) = 3.94, _p_ = .001, partial η² = .092**。Box's M 显著（_p_ < .001），故采用 Pillai's Trace。
>
> 后续单因素方差分析（Bonferroni 校正后 α = .017）显示：
>
> - 焦虑：_F_(2, 117) = 7.21, _p_ = .001, η² = .110
> - 抑郁：_F_(2, 117) = 5.43, _p_ = .006, η² = .085
> - 压力：_F_(2, 117) = 2.18, _p_ = .118
>
> Tukey HSD 显示，CBT 组在焦虑（_M_ = 5.2 vs. 8.4, _p_ < .001）和抑郁（_M_ = 6.1 vs. 9.0, _p_ = .003）上显著低于对照组，但与心理动力学组无显著差异（*p*s > .15）。压力变量三组差异不显著。

报告的几个要点：

- 主结果选 **Pillai's Trace**（最稳健）。
- 后续 ANOVA 阶段做 **Bonferroni 校正**，且要在论文里**写清楚校正后的 α 是多少**。
- 报告 partial η² 作为效应量。
- 解释时围绕"哪个 DV 在驱动整体差异"展开，不能笼统说"治疗有效"。

## 八、为什么应该考虑改用 SEM

如果你的研究问题有以下任何一条，强烈建议直接走 SEM（见 [3.7](./sem)），而不是 MANOVA：

| 你的需求              | MANOVA 能做的   | SEM 能做的                           |
| --------------------- | --------------- | ------------------------------------ |
| DV 之间有因果路径     | ❌ 无法建模     | ✅ 路径系数 + 直接/间接效应          |
| 用潜变量代替合成分    | ❌ 只能用合成分 | ✅ 含测量误差校正                    |
| 多组比较 + 跨组等价性 | 部分能做        | ✅ multi-group SEM                   |
| 纵向 / 时间序列       | ❌              | ✅ latent growth curve, cross-lagged |
| 模型整体拟合度        | ❌              | ✅ CFI, RMSEA, SRMR 等               |

::: info MANOVA 的现代位置
本世纪以来 MANOVA 在心理学论文中的占比逐年下降，已经不再是默认工具。
:::

## 资源与工具

<ResourceGrid :min="220">
  <ResourceCard
    name="statsmodels MANOVA"
    desc="Python 标准实现 · 同时输出四种统计量"
    href="https://www.statsmodels.org/stable/generated/statsmodels.multivariate.manova.MANOVA.html"
    icon="🐍"
  />
  <ResourceCard
    name="pingouin"
    desc="多元正态性、Box's M 检验都很方便"
    href="https://pingouin-stats.org/"
    icon="🐧"
  />
  <ResourceCard
    name="JASP"
    desc="开源 GUI · MANOVA 一键导出 APA 表"
    href="https://jasp-stats.org/"
    icon="🧮"
  />
  <ResourceCard
    name="lavaan (R)"
    desc="SEM 标杆工具 · MANOVA 的现代替代方案"
    href="https://lavaan.ugent.be/"
    icon="📐"
  />
</ResourceGrid>

## 延伸阅读

- Tabachnick, B. G., & Fidell, L. S. (2019). _Using multivariate statistics_ (7th ed.), Chapter 7. ——MANOVA 实操标准参考。
- Huberty, C. J., & Olejnik, S. (2006). _Applied MANOVA and discriminant analysis_ (2nd ed.). Wiley. ——MANOVA + DFA 的全面教材。
- Field, A. (2018). _Discovering statistics using IBM SPSS statistics_ (5th ed.), Chapter 17. ——SPSS 用户的友好入门。
