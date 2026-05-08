---
title: 3.2.2 方差分析（ANOVA）
description: 从"多次 t 检验为什么不行"讲到方差分解、事后比较、交互效应、协方差分析，含 SPSS 与 Python 实现
---

# 3.2.2 方差分析（ANOVA）

::: tip 本节目标

- 弄懂 ANOVA 和 t-test 的差异和适用场景。
- 区分**主效应**与**交互效应**，并知道一张 profile plot 该怎么读。
- 在显著之后选对**事后比较**方法（Tukey / Bonferroni / Scheffé / Games-Howell / Dunnett 各自适合什么场景）。
- 会用并知道**何时不要用** ANCOVA。
- 在 SPSS 和 Python 中跑出单因素、双因素、协方差三种 ANOVA，并写出符合 APA 7 的报告。

:::

<OutlineCard title="本节路线图">

- 为什么需要 ANOVA：多次 t 检验的局限
- 核心原理：方差的分解
- ANOVA 的几种形态（一图读完）
- 用之前要满足什么条件
- 单因素 ANOVA 完整例子：情绪 × 创造力
- 事后比较：显著之后做什么
- 效应量：η²、partial η²、ω²
- 双因素 ANOVA：交互效应才是关键
- 协方差分析（ANCOVA）：目的与陷阱
- SPSS / Python 实现
- 常见错误与替代方案

</OutlineCard>

## 一、为什么需要 ANOVA：从一个困境说起

回想 [3.2.1](./t-test) 独立样本 t 检验，它一次只能比较两组。如果有**三组**怎么办？很多人的第一反应是"做三次 t 检验呗"——A vs B、A vs C、B vs C。

这就是经典陷阱——每做一次 t 检验，你都允许自己有 5% 的概率犯 I 类错误。**做三次比较，至少出现一次假阳性的概率不再是 5%**：

$$
P(\text{至少一次假阳性}) = 1 - (1 - 0.05)^3 \approx 14\%
$$

四组就要做 $\binom{4}{2} = 6$ 次比较，假阳性概率提升到 $1 - 0.95^6 \approx 26\%$。<span class="kw">你以为自己在严格控制 5%，其实早已不符合预先确定的统计功效。</span>

ANOVA 的解决思路很巧妙：**不再问"A 和 B 是否不同"这种两两问题，而是先问一个总的问题——"这几组里，是不是至少有一组跟别人不一样？"** 这个总问题用一次 F 检验回答，I 类错误率严格控制在 5%。如果总检验显著，再做事后比较确定具体是哪几组之间的差异（且事后比较会对多重比较做校正）。

## 二、ANOVA 的核心原理：方差的分解

### 1. 信号与噪声

ANOVA 的 F 值和 t 检验的 t 值在假设检验的原理上相同——都是**信噪比**：

$$
F = \frac{\text{组间方差（信号）}}{\text{组内方差（噪声）}} = \frac{MS_{\text{between}}}{MS_{\text{within}}}
$$

- **分子（组间方差）**：各组**均值**离总均值有多远——如果各组真的不同，这个值会大。
- **分母（组内方差）**：每组**内部**个体围绕自己的组均值散得多开——这是"随机波动的基线"。
- F 值大 → 组间差异远大于组内噪声 → 拒绝"所有组均值相等"。
- F 值接近 1 → 组间差异跟组内噪声差不多 → 不能拒绝零假设。

::: tip 一个生活化的对比
你想知道"用功程度"是否影响考试成绩，把学生分成"很用功""一般""不用功"三组：

- 如果三组**内部**成绩波动很小（很用功的都 90+，不用功的都 60-），三组**之间**均值又差很多 → F 大，差异显著。
- 如果三组**内部**就上下飘 30 分（每组都有学霸学渣），三组**之间**均值差 5 分 → F 小，差异可能只是抽样运气。
  :::

### 2. 方差分解（Sum of Squares）

ANOVA 把全部数据的总变异拆成两块：

$$
\underbrace{SS_{\text{total}}}_{\text{所有数据离总均值有多散}} = \underbrace{SS_{\text{between}}}_{\text{组间差异}} + \underbrace{SS_{\text{within}}}_{\text{组内差异}}
$$

具体公式（设有 $k$ 组，每组 $n_j$ 人，第 $j$ 组的均值是 $\bar{X}_j$，总均值是 $\bar{\bar{X}}$）：

$$
SS_{\text{between}} = \sum_{j=1}^{k} n_j (\bar{X}_j - \bar{\bar{X}})^2
$$

$$
SS_{\text{within}} = \sum_{j=1}^{k} \sum_{i=1}^{n_j} (X_{ij} - \bar{X}_j)^2
$$

均方（mean square）= 平方和 / 自由度：

| 来源 | SS                    | df      | MS             |
| ---- | --------------------- | ------- | -------------- |
| 组间 | $SS_{\text{between}}$ | $k - 1$ | $SS_b / (k-1)$ |
| 组内 | $SS_{\text{within}}$  | $N - k$ | $SS_w / (N-k)$ |
| 总和 | $SS_{\text{total}}$   | $N - 1$ | —              |

最终：

$$
F = \frac{MS_{\text{between}}}{MS_{\text{within}}}, \quad \text{自由度} = (k-1, N-k)
$$

### 3. F 与 t 的关系

::: details 一个值得知道的小事实
当只有两组时（k = 2），ANOVA 和独立样本 t 检验**在数学上等价**：

$$
F = t^2
$$

例如 t = 2.50, df = 58 → F = 6.25, df = (1, 58)，p 值完全相同。这也解释了为什么 ANOVA 输出里用 F 不用 t——它是一个能扩展到任意组数的统一框架。
:::

## 三、ANOVA 的几种形态

| 名称                    | 自变量结构                   | 因变量结构            | 典型例子                    |
| ----------------------- | ---------------------------- | --------------------- | --------------------------- |
| **单因素 ANOVA**        | 1 个分类 IV（≥3 水平）       | 1 个连续 DV（被试间） | 三种情绪启动 → 创造力       |
| **双因素 ANOVA**        | 2 个分类 IV                  | 1 个连续 DV（被试间） | 性别 × 威胁条件 → 数学成绩  |
| **重复测量 ANOVA**      | 1 个 IV（被试内重复）        | 1 个连续 DV           | 同一批人在 3 个时间点的焦虑 |
| **混合 ANOVA**          | 1 个被试间 + 1 个被试内      | 1 个连续 DV           | 治疗组 × 时间点 → 抑郁分    |
| **协方差分析 (ANCOVA)** | 1+ 个分类 IV + 1+ 连续协变量 | 1 个连续 DV           | 控制基线焦虑后的干预效果    |
| **MANOVA**              | 1+ 个分类 IV                 | **多个**连续 DV       | 见 [3.2.3](./manova)        |

本节讲前 3 类 + ANCOVA。重复测量与混合 ANOVA 在多层模型框架下处理更灵活，会在 [3.6](./mixed-effects) 顺带覆盖。

## 四、用之前要满足什么条件

### 1. 三个核心假设

- **观测独立**：和 t 检验一致。同班同学、同对夫妻这种数据不能直接做 ANOVA。
- **每个组内 DV 近似正态**：n ≥ 30 时由中心极限定理保护，问题不大。
- **方差齐性**（homogeneity of variance）：各组方差大致相等。Levene's test 可检验，但与 t 检验同理——**现代推荐直接用 Welch's ANOVA**（SPSS 和 Python 都支持），方差不齐时不必先做 Levene's。

### 2. 一些容易忽略的实操要求

- **每组至少 ~20–30 人**：太小的组让方差估计很不稳定。
- **大致平衡的样本量**：极不平衡（比如 5 vs 100 vs 50）时 SS 类型的选择就开始有讲究了（见下一节）。
- **没有极端异常值**：F 比 t 还更敏感——一个异常值能让某组方差膨胀，把整张表的 F 都拉小。

### 3. SS 类型（Type I / II / III）：因素不平衡时绕不开的概念

::: details 什么是 Type III SS，为什么 SPSS 默认用它
当各因素水平**样本量不等**时，"某个因素的 SS"就有歧义——它是否要扣除其他因素的影响？

- **Type I**（顺序型）：按你输入因素的顺序逐个扣除。结果**依赖于因素顺序**，几乎从不用于解释性分析。
- **Type II**：扣除其他主效应，但**不**扣除包含它的交互效应。无交互时较有功效。
- **Type III**（**SPSS 默认**）：扣除所有其他效应（含交互）。社心方向论文里如果不特别说明，<span class="kw">报的就是 Type III SS</span>。

完美平衡设计下三种 SS 给出相同结果。不平衡时优先用 Type III（更保守），并在论文里说明。R 里默认是 Type I，要主动指定 `car::Anova(model, type=3)`，且需要先设置 `options(contrasts = c("contr.sum", "contr.poly"))`。
:::

## 五、单因素 ANOVA：一个完整例子

### 1. 研究背景

社心方向有个经典假设：**积极情绪扩展认知范围、提升创造力**（Fredrickson 的 broaden-and-build 理论）。我们设计一个简单实验来检验：

- **IV**（被试间）：情绪启动条件，3 水平
  - 积极情绪（看搞笑视频）
  - 中性情绪（看说明书）
  - 消极情绪（看悲伤视频）
- **DV**：创造力分数（远距离联想测验 RAT，0–10 分）

### 2. 假设虚拟数据

| 组别 | n   | M    | SD   |
| ---- | --- | ---- | ---- |
| 积极 | 30  | 7.20 | 1.50 |
| 中性 | 30  | 6.10 | 1.40 |
| 消极 | 30  | 5.80 | 1.60 |

### 3. F 检验思路

```
H0: μ积极 = μ中性 = μ消极  （三组均值都相等）
H1: 至少有一组与其他不同
```

如果跑出来 F(2, 87) = 7.34, p = .001，说明**至少有一对**显著不同——但**不知道**是哪一对。这就是为什么需要事后比较。

::: warning F 显著只是入场券
F 显著意味着"组间存在差异"，但**不告诉你**：

- 是哪两组之间显著
- 差异的方向
- 差异有多大

这三个问题分别要靠：事后比较 / 描述性统计 / 效应量来回答。
:::

## 六、事后比较：显著之后做什么

事后比较的核心目的：**做多次比较的同时，控制总的假阳性率**（family-wise error rate, FWER）。

### 1. 常用方法对比

| 方法             | 适用场景                 | 严格度            | 备注                                   |
| ---------------- | ------------------------ | ----------------- | -------------------------------------- |
| **Tukey HSD**    | 所有两两比较             | 中                | 社心方向**最常用**；要求方差齐         |
| **Bonferroni**   | 任意几个比较             | 高（保守）        | 简单、可用于任何情形；比较多时损失功效 |
| **Sidak**        | 任意几个比较             | 略宽于 Bonferroni | 用得少；比较独立时更准                 |
| **Scheffé**      | 任意复杂对比             | 最高              | 包括"A vs (B+C 平均)"这种线性组合      |
| **Games-Howell** | 所有两两比较             | 中                | **方差不齐时用它替代 Tukey**           |
| **Dunnett**      | 所有组 vs **一个对照组** | 中                | 临床/干预研究的标配                    |
| **LSD**          | 所有两两比较             | **不校正**        | 只在 F 显著后用，但仍不推荐            |

### 2. 方法选择的简单技巧

::: code-group

```text [常规情况]
1. 你的目的是什么？
   - 所有组两两比较 → Tukey HSD（方差齐）/ Games-Howell（方差不齐）
   - 比所有组与对照组 → Dunnett
   - 检验线性趋势或自定义对比 → 计划比较 / Scheffé

2. 比较数目不多（≤3）但需要绝对保守 → Bonferroni
3. 比较数目很多（>10）→ Bonferroni 损失功效大，考虑 FDR 校正
```

```text [通用解法]
默认 Games-Howell（不依赖方差齐性假设），
报告时附上调整后的 p 值和均值差的 95% CI。
```

:::

### 3. 接续上面的例子

跑 Tukey HSD 后假设得到：

| 比较         | 均值差 | p (Tukey 调整后) | 95% CI        |
| ------------ | ------ | ---------------- | ------------- |
| 积极 vs 中性 | 1.10   | .013             | [0.21, 2.00]  |
| 积极 vs 消极 | 1.40   | < .001           | [0.51, 2.30]  |
| 中性 vs 消极 | 0.30   | .69              | [-0.59, 1.20] |

这告诉我们：积极情绪的创造力**显著高于**中性和消极组，但中性与消极没差异。和 broaden-and-build 理论中"是积极情绪本身有效"的预测一致——不仅仅是"消极情绪损害创造力"。

::: tip 计划比较 vs 事后比较
事后比较是"看到结果后再决定比哪些"，要做严格校正。**计划比较**（planned contrasts）是论文/预注册里**事先**写明的特定对比（比如"我假设积极情绪比另外两组的平均水平高"），可以用更宽松的标准（甚至不校正），但前提是<span class="kw">必须事先声明、事先写在预注册里</span>。
:::

## 七、效应量：η²、partial η²、ω²

光报 F 和 p 不够。F 大可以是因为效应大、也可以是因为样本量大。**效应量**才告诉你"效应实际上有多大"。

### 1. 三个常见指标

$$
\eta^2 = \frac{SS_{\text{effect}}}{SS_{\text{total}}}
$$

总变异中被这个因素解释的比例。**简单直观，但有偏（小样本下高估）**。

$$
\eta_p^2 = \frac{SS_{\text{effect}}}{SS_{\text{effect}} + SS_{\text{error}}}
$$

partial η²，**不受其他因素影响**，是 SPSS 双因素 ANOVA 的默认输出。注意：在双因素及以上设计中，所有 partial η² 加起来**可以超过 1**（每个都用了独立的"该效应 + 误差"作分母），别被这点搞糊涂。

$$
\omega^2 = \frac{SS_{\text{effect}} - (k-1) MS_{\text{error}}}{SS_{\text{total}} + MS_{\text{error}}}
$$

omega-squared，**无偏估计**。小样本时与 η² 差距明显，通常**比 η² 略小**。审稿严格的期刊越来越偏爱 ω²。

### 2. Cohen 的解读标尺（仅供参考）

| 量级 | η² / partial η² | Cohen's f |
| ---- | --------------- | --------- |
| 小   | 0.01            | 0.10      |
| 中   | 0.06            | 0.25      |
| 大   | 0.14            | 0.40      |

::: warning 如何评估效应量
Cohen 的标尺是 1988 年基于行为科学普遍水平制定的。不同子领域基线不同——

- 反应时实验里 partial η² > 0.20 算正常；
- 横断问卷研究里 partial η² > 0.10 就已经偏大。

更可靠的做法是与同一研究问题的 meta-analysis 比较。
:::

### 3. 单因素 ANOVA 例子的效应量

继续上面的情绪 × 创造力数据：F(2, 87) = 7.34, p = .001。

- η² = 0.144（创造力 14.4% 的变异被情绪条件解释）
- ω² = 0.123（无偏估计，比 η² 略小）

## 八、双因素 ANOVA：交互效应才是关键

### 1. 主效应 vs. 交互效应

双因素设计同时操纵两个分类 IV，可以同时检验三个东西：

- **A 的主效应**（main effect of A）：忽略 B，A 的不同水平之间是否有差异？
- **B 的主效应**：忽略 A，B 的不同水平之间是否有差异？
- **A × B 交互效应**（interaction）：A 的效应是否依赖于 B 的水平？

**交互效应几乎永远是双因素设计真正想检验的东西**——它直接对应"调节效应"的统计检验（[3.5](./mediation-moderation)）。

### 2. 经典例子：刻板印象威胁

Steele & Aronson (1995) 的刻板印象威胁效应：

- 当数学测验被框架为"诊断认知能力"时，女性表现下降；男性不受影响。
- 当被框架为"无关认知"时，性别差异消失。

设计：

- **IV1**：威胁条件（威胁 / 无威胁）
- **IV2**：性别（女 / 男）
- **DV**：数学成绩（0–100）

### 3. 假设虚拟数据（2 × 2，每格 n = 25）

|                | 女性    | 男性    |
| -------------- | ------- | ------- |
| **威胁条件**   | 65 (12) | 78 (10) |
| **无威胁条件** | 76 (11) | 79 (11) |

格子里是 _M_ (_SD_)。

### 4. 三个效应分别说什么

跑出 ANOVA 表（数字仅示意）：

| 来源           | F     | df      | p    | partial η² |
| -------------- | ----- | ------- | ---- | ---------- |
| 威胁条件主效应 | 8.34  | (1, 96) | .005 | .080       |
| 性别主效应     | 12.45 | (1, 96) | .001 | .115       |
| 威胁 × 性别    | 6.78  | (1, 96) | .011 | .066       |

- **威胁主效应**：威胁组（71.5）< 无威胁组（77.5）。但这个平均掩盖了真相。
- **性别主效应**：男性（78.5）> 女性（70.5）。这个也只是表象。
- **交互效应**：威胁的影响**依赖于**性别。这才是关键。

### 5. profile plot 怎么读

![刻板印象威胁 × 性别 在数学成绩上的交互效应](/images/chapters/3-statistics/anova-profile-plot.png)

判断有没有交互效应只看一件事——**两条线是否平行**：

- **平行** → 无交互（一个 IV 的效应在另一个 IV 各水平上一致）
- **不平行** → 有交互
- **相交（叉形）** → "全交叉"交互（disordinal）：方向甚至会反转
- **不相交但发散** → "顺序型"交互（ordinal）

上图的两条线明显不平行——威胁条件下女男差 13 分，无威胁条件下只差 3 分。这就是 _F_(1, 96) = 6.78, _p_ = .011 这个交互效应在视觉上长什么样。

::: details 想自己复现这张图？
完整脚本：[generate_anova_plots.py](/code/generate_anova_plots.py)。改改 `female_means`、`male_means` 这几个数组就能用在你自己的数据上，同时会生成 profile plot 和 bar chart 两版。
:::

### 6. 简单效应分析

交互显著后，要做**简单效应分析**（simple effects analysis）——固定一个 IV 的水平，看另一个 IV 在该水平下的效应。例如：

- 在**威胁条件**下检验性别效应：男性 (78) vs. 女性 (65)，_F_(1, 96) = 18.5, _p_ < .001（显著）
- 在**无威胁条件**下检验性别效应：男性 (79) vs. 女性 (76)，_F_(1, 96) = 1.2, _p_ = .28（不显著）

结论：**性别差异只在威胁条件下出现**——这正是刻板印象威胁理论的核心预测。

::: warning 主效应不能光看平均值
看到"威胁主效应显著"就以为"威胁让所有人变差"是错的——交互显著时，主效应的解释**必须分组讨论**。<span class="kw">交互显著时主效应通常意义有限。</span>
:::

## 九、协方差分析（ANCOVA）

### 1. ANCOVA 在做什么

ANCOVA = ANOVA + **连续协变量**（covariate）。它在检验组间均值差异时，把协变量的影响"统计上扣除"：

$$
\text{校正后的均值} = \bar{X}_{\text{组}} - b \times (\bar{X}_{\text{协变量, 组}} - \bar{X}_{\text{协变量, 总}})
$$

输出会给"调整均值"（adjusted mean / estimated marginal mean），就是把每组在协变量上的差异**抹平**到总均值水平后的预测。

### 2. 用 ANCOVA 的两个正当目的

- **降低误差方差，提升功效**：如果协变量与 DV 高度相关，把它的方差先排除，剩下的组间差异在更小的"噪声"背景下变得显著。
- **控制随机分配后仍存在的微小不平衡**：随机分配理论上会平衡所有变量，但小样本下仍可能不平衡，ANCOVA 可以做事后校正。

### 3. ANCOVA 的三个关键假设

1. **协变量与 DV 之间是线性关系**（不是 U 型、对数等）。
2. **组间回归斜率相等**（homogeneity of regression slopes）：每组里"协变量 → DV"的斜率应该一致。如果不等，意味着有协变量 × IV 的交互——这时不是 ANCOVA 的问题，而是模型本身需要重新考虑。
3. **协变量在 IV 操纵之前测量**——这是 ANCOVA **最容易踩的坑**。

<!-- ### 4. 别用 ANCOVA 来"找补"非随机分组

::: danger Lord 悖论
Lord (1967) 提出的悖论：两组**自然形成**（不是随机分配）的被试，他们在协变量上有不同的均值。你想知道"控制协变量后的组间差异"。

- 用变化分（DV_post - DV_pre）：可能得到"无差异"。
- 用 ANCOVA（DV_post 为 DV，DV_pre 为协变量）：可能得到"显著差异"。

两个分析都"对"，但结论相反——因为它们回答的是不同的因果问题。<span class="kw">在非随机分配的情况下，ANCOVA 不能"修复"组间的预存差异，只是把因果推断的责任偷偷转移给了一个未必合理的统计假设。</span>

实操底线：

- **随机分配的实验** + **基线变量作协变量** → 用 ANCOVA 没问题，且推荐。
- **非随机分组**（自然组、自选组）→ ANCOVA 不能简单地把组间差异"抹平"。需要倾向得分匹配、工具变量等更专业的因果推断方法。
  ::: -->

::: danger ANCOVA的常见误用
如果协变量是在 IV 操纵**之后**测量的，且它本身受 IV 影响，那么把它当协变量"控制"会造成 collider bias（对撞偏差）——你不仅没控制混淆，反而**人为制造**了选择偏差。

实操规则：协变量必须是**操纵前**就确定的特征（基线测量、人口学、稳定特质），永远不要把后测的、可能受操纵影响的变量当协变量。
:::

## 十、SPSS 实现

### 1. 单因素 ANOVA

**菜单**：`Analyze → Compare Means → One-Way ANOVA`

**语法**：

```spss
ONEWAY creativity BY emotion
  /STATISTICS DESCRIPTIVES HOMOGENEITY WELCH
  /POSTHOC = TUKEY GH ALPHA(0.05).
```

`WELCH` 给出 Welch 校正后的 F；`GH` 是 Games-Howell 事后比较（方差不齐时用）。

### 2. 双因素 ANOVA（含交互）

**菜单**：`Analyze → General Linear Model → Univariate`

把 DV 拖入 Dependent Variable；把两个 IV 拖入 Fixed Factor(s)；点 Plots 设置 profile plot；点 Options 勾 Estimates of effect size、Descriptive statistics、Homogeneity tests。

**语法**：

```spss
UNIANOVA math_score BY threat gender
  /METHOD=SSTYPE(3)
  /POSTHOC = threat gender (TUKEY)
  /PLOT=PROFILE(threat*gender)
  /EMMEANS=TABLES(threat*gender) COMPARE(threat) ADJ(BONFERRONI)
  /EMMEANS=TABLES(threat*gender) COMPARE(gender) ADJ(BONFERRONI)
  /PRINT = ETASQ DESCRIPTIVE HOMOGENEITY
  /CRITERIA=ALPHA(.05).
```

`COMPARE(...)` 那两行做的就是**简单效应分析**——分别在每个 threat 水平下比较 gender、在每个 gender 水平下比较 threat。

### 3. ANCOVA

```spss
UNIANOVA posttest BY group WITH pretest
  /METHOD=SSTYPE(3)
  /EMMEANS=TABLES(group) WITH(pretest=MEAN) COMPARE ADJ(BONFERRONI)
  /PRINT=ETASQ DESCRIPTIVE
  /CRITERIA=ALPHA(.05).
```

注意 `WITH` 关键词——SPSS 用它区分协变量（continuous）和因素（categorical）。`EMMEANS` 给的就是**调整后的均值**。

### 4. 检验 ANCOVA 的同质斜率假设

```spss
UNIANOVA posttest BY group WITH pretest
  /DESIGN=group pretest group*pretest.
```

如果 `group*pretest` 显著，说明斜率不齐，ANCOVA 假设违背。

## 十一、Python 实现

### 1. 单因素 ANOVA

::: code-group

```python [scipy（最简）]
from scipy import stats

f, p = stats.f_oneway(positive, neutral, negative)
# 注意：scipy 没有事后比较，也没有效应量
```

```python [statsmodels（标准）]
import statsmodels.api as sm
from statsmodels.formula.api import ols

model = ols('creativity ~ C(emotion)', data=df).fit()
anova_table = sm.stats.anova_lm(model, typ=2)
print(anova_table)
```

```python [pingouin（推荐）]
import pingouin as pg

# 主检验
pg.anova(data=df, dv='creativity', between='emotion', detailed=True)
# 输出含 SS, DF, MS, F, p, np2 (partial η²)

# Welch's ANOVA（方差不齐时）
pg.welch_anova(data=df, dv='creativity', between='emotion')

# 事后比较
pg.pairwise_tukey(data=df, dv='creativity', between='emotion')
pg.pairwise_gameshowell(data=df, dv='creativity', between='emotion')
pg.pairwise_tests(data=df, dv='creativity', between='emotion', padjust='bonf')
```

:::

### 2. 双因素 ANOVA

```python
# pingouin
pg.anova(data=df, dv='math_score',
         between=['threat', 'gender'], detailed=True)

# statsmodels（含交互）
model = ols('math_score ~ C(threat) * C(gender)', data=df).fit()
anova_table = sm.stats.anova_lm(model, typ=3)  # 注意 Type III
print(anova_table)
```

::: warning Python 跑 Type III SS 有个坑
statsmodels 的 `anova_lm` 默认是 Type II SS，要显式写 `typ=3`。但仅指定 `typ=3` 还不够——必须把分类变量编码为 **sum contrast**（或叫 effect coding）：

```python
from patsy.contrasts import Sum
model = ols('math_score ~ C(threat, Sum) * C(gender, Sum)', data=df).fit()
sm.stats.anova_lm(model, typ=3)
```

如果不改 contrast，得到的"Type III SS"其实是错的。这是 R 用户和 SPSS 用户来 Python 时最常踩的坑。pingouin 已经帮你处理好了，所以一般推荐 pingouin。
:::

### 3. 简单效应分析

```python
# 在 threat=1（威胁条件）下检验 gender 效应
threat_data = df[df['threat'] == 'threat']
pg.anova(data=threat_data, dv='math_score', between='gender')

# 或者一次解决
pg.pairwise_tests(data=df, dv='math_score',
                  between=['threat', 'gender'])
```

### 4. ANCOVA

```python
import pingouin as pg

pg.ancova(data=df, dv='posttest', between='group', covar='pretest')
# 输出含主效应、协变量效应、partial η²
```

### 5. 可视化（必看）

```python
import seaborn as sns
import matplotlib.pyplot as plt

# 单因素：箱线图 + 点图
sns.boxplot(data=df, x='emotion', y='creativity')
sns.stripplot(data=df, x='emotion', y='creativity', color='black', alpha=0.3)

# 双因素：profile plot（看交互）
sns.pointplot(data=df, x='threat', y='math_score', hue='gender',
              dodge=0.1, errorbar='se')
```

<span class="kw">ANOVA 跑出结果第一件事就是画 profile plot</span>，光看数字常会漏掉交互的方向。

## 十二、APA 报告模板

### 1. 单因素 ANOVA + 事后比较

> 单因素方差分析显示，情绪条件对创造力得分有显著影响，_F_(2, 87) = 7.34, _p_ = .001, η² = .14, 90% CI [.04, .25]。Tukey HSD 事后比较表明，积极情绪组的创造力（_M_ = 7.20, _SD_ = 1.50）显著高于中性组（_M_ = 6.10, _SD_ = 1.40），_p_ = .013, 95% CI for mean difference [0.21, 2.00]，也显著高于消极组（_M_ = 5.80, _SD_ = 1.60），_p_ < .001, 95% CI [0.51, 2.30]；中性组与消极组之间无显著差异，_p_ = .69。

### 2. 双因素 ANOVA + 简单效应

> 2（威胁：威胁/无威胁）× 2（性别：女/男）方差分析揭示，威胁条件主效应显著，_F_(1, 96) = 8.34, _p_ = .005, partial η² = .080；性别主效应显著，_F_(1, 96) = 12.45, _p_ = .001, partial η² = .115。**关键的，威胁 × 性别交互效应显著**，_F_(1, 96) = 6.78, _p_ = .011, partial η² = .066。
>
> 简单效应分析显示，在威胁条件下，女性（_M_ = 65.0）数学成绩显著低于男性（_M_ = 78.0），_F_(1, 96) = 18.5, _p_ < .001；而在无威胁条件下，性别差异不显著，_F_(1, 96) = 1.20, _p_ = .28（女性 _M_ = 76.0；男性 _M_ = 79.0）。这一模式与刻板印象威胁理论的预测一致。

### 3. ANCOVA

> 在控制基线焦虑分（pretest）后，干预组与对照组的后测焦虑分存在显著差异，_F_(1, 117) = 14.32, _p_ < .001, partial η² = .109。干预组的调整均值（_M_\_adj = 18.4, _SE_ = 0.5）显著低于对照组（_M_\_adj = 22.7, _SE_ = 0.5），均值差 = -4.30, 95% CI [-6.55, -2.05]。基线分对后测分有显著正向影响，_F_(1, 117) = 89.21, _p_ < .001。

## 十三、常见错误清单

::: danger 最常踩的坑

1. **三组数据做三次 t 检验**——I 类错误率从 5% 飙到 14%。请用 ANOVA + 事后比较。
2. **F 显著就大功告成**——F 显著只是入场券，必须做事后比较或简单效应才能定位差异。
3. **F 不显著但仍做事后比较**——传统流程要求 F 显著才做。但若有**计划比较**且预注册，可以直接做。
4. **交互显著时只解读主效应**——交互显著时主效应的解释必须分水平，不能"平均掉"。
5. **不报告效应量**——APA 7 要求必报。η² / partial η² / ω² 选一个，但要说清楚是哪一个。
6. **协变量是后测变量**——若协变量受 IV 影响，控制它会引入对撞偏差，结论不可信。

:::

## 十四、什么时候不该用 ANOVA

| 你的情况                    | 替代方案                                    |
| --------------------------- | ------------------------------------------- |
| 二分类 DV                   | Logistic 回归 / 卡方                        |
| 严重偏态 + 小样本           | Kruskal-Wallis（非参 ANOVA）                |
| 重复测量                    | 重复测量 ANOVA / 多层模型                   |
| 嵌套 / 多层数据             | 多层线性模型（[3.6](./mixed-effects)）      |
| 多个连续 DV 同时考察        | MANOVA（[3.2.3](./manova)）                 |
| 协变量与 DV 关系非线性      | 用回归 + 多项式项 / GAM                     |
| 因子水平有顺序（如剂量）    | 趋势分析（线性、二次对比）                  |
| 想用调节而非"分类 IV"的视角 | 调节回归（[3.5.2](./mediation-moderation)） |

## 资源与工具

<ResourceGrid :min="220">
  <ResourceCard
    name="pingouin"
    desc="Python 心理学统计包 · ANOVA / ANCOVA 默认输出 partial η²"
    href="https://pingouin-stats.org/"
    icon="🐧"
  />
  <ResourceCard
    name="afex (R)"
    desc="ANOVA 一站式包 · 自动处理 Type III SS 与 contrast"
    href="https://github.com/singmann/afex"
    icon="📦"
  />
  <ResourceCard
    name="JASP"
    desc="开源软件 · ANOVA 输出贝叶斯因子和 robust 版本"
    href="https://jasp-stats.org/"
    icon="🧮"
  />
  <ResourceCard
    name="Lakens (2013)"
    desc="效应量计算与报告的实操教程"
    href="https://www.frontiersin.org/articles/10.3389/fpsyg.2013.00863/full"
    icon="📏"
  />
</ResourceGrid>

## 延伸阅读

- Maxwell, S. E., Delaney, H. D., & Kelley, K. (2018). _Designing experiments and analyzing data: A model comparison perspective_ (3rd ed.). Routledge. ——ANOVA / ANCOVA 的标准研究生教材。
- Lord, F. M. (1967). A paradox in the interpretation of group comparisons. _Psychological Bulletin, 68_(5), 304–305. ——Lord 悖论原文，三页纸但极清晰。
- Miller, G. A., & Chapman, J. P. (2001). Misunderstanding analysis of covariance. _Journal of Abnormal Psychology, 110_(1), 40–48. ——心理学家滥用 ANCOVA 的批判性综述，必读。
- Lakens, D. (2013). Calculating and reporting effect sizes to facilitate cumulative science. _Frontiers in Psychology, 4_, 863. ——η² / partial η² / ω² / Cohen's f 的关系与计算。
- Steele, C. M., & Aronson, J. (1995). Stereotype threat and the intellectual test performance of African Americans. _Journal of Personality and Social Psychology, 69_(5), 797–811. ——双因素 ANOVA 经典论文，本节例子改编自此。
