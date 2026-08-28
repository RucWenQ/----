---
title: 3.2.2 方差分析（ANOVA）
description: 从研究问题选择单因素、双因素、重复测量或协方差分析，并用同一份数据完成检验、事后比较和报告
---

# 3.2.2 方差分析（ANOVA）

::: tip 本节目标

读完后，你能根据变量和观测结构选择 ANOVA 的形态，运行一个最小的单因素分析，知道显著的 F 检验还缺什么，并在交互或协变量情形下避免过度解释。

:::

<OutlineCard title="先走最短路径">

- 先问研究问题：比较几组均值，还是问一个因素的效应是否随另一个因素改变？
- 再核对观测结构：每行是否是独立被试，还是同一被试有多次测量？
- 选择模型并检查残差、离群点和组间样本量；不要把某个样本量数字当成自动通行证。
- 先读总体检验，再按预先计划的对比或合适的事后方法定位差异。
- 报告均值和不确定性、F（或 Welch F）、效应量、对比校正和设计边界。

</OutlineCard>

## 一、ANOVA 回答什么问题

**单因素 ANOVA**检验多个独立组的总体均值是否相同：

$$
H_0: \mu_1=\mu_2=\cdots=\mu_k
$$

备择假设是“至少一个均值不同”，并不保证所有组两两不同。F 统计量把组间均方与组内均方相比：

$$
F=\frac{MS_{\text{between}}}{MS_{\text{within}}},\qquad df_1=k-1,\quad df_2=N-k
$$

当只有两个独立组时，经典等方差 ANOVA 与 Student t 检验满足 $F=t^2$；这不表示 Welch t 和等方差 ANOVA 在方差不齐时也完全相同。ANOVA 只描述组均值的差异，不能单凭显著性证明操纵造成了差异；因果措辞还需要随机分配、操纵执行和缺失处理等设计条件。

## 二、先按数据结构选模型

| 你的问题与数据 | 常用模型 | 先检查什么 | 不要直接做什么 |
| --- | --- | --- | --- |
| 一个分类因素，三个或更多被试间水平；一个连续结果 | 单因素 ANOVA；方差不齐可用 Welch ANOVA | 每行是否为一名独立被试 | 把同一被试的多次测量当成独立行 |
| 两个分类因素，一个连续结果 | 双因素 ANOVA（含交互） | 每个因素组合是否有足够观测、是否有空 cell | 只看两个主效应而跳过交互 |
| 同一被试在三个或更多条件/时间点测量 | 重复测量 ANOVA 或混合效应模型 | 被试内相关、球形性（传统 RM-ANOVA） | 用独立组 ANOVA 假装独立 |
| 一个被试间因素 + 一个被试内因素 | 混合 ANOVA 或混合效应模型 | 两种相关结构和缺失模式 | 把所有观测当作同一层次 |
| 比较组均值，同时控制操纵前连续变量 | ANCOVA | 线性关系、回归斜率同质、协变量确在处理前 | 用后处理变量“控制”处理效应 |
| 多个相关连续结果的整体差异 | MANOVA（见 [3.2.3](./manova)） | 结果间相关和协方差矩阵 | 对每个结果反复检验而不处理多重性 |

如果结果是二分类、计数或明显有序等级，先到 [变量与方法对照表](./foundations#method-lookup) 判断是否应使用广义线性模型或有序模型；ANOVA 的连续结果假设不能靠改写变量名解决。

## 三、假设与诊断：不要用一个阈值代替判断

1. **独立性来自研究设计**：同一班级、同一家庭或同一被试的观测可能相关。画图或做 Levene 检验不能修复独立性问题；需要多层/混合模型（见 [3.6](./multilevel)）或明确的聚类处理。
2. **模型残差近似正态**：不是要求原始分数“必须正态”。在样本量、平衡性和离群点都合理时，F 检验对中等偏离可能不敏感；小而不平衡的组、重尾分布或强离群点时应做敏感性分析或改用稳健模型。不存在普遍适用的“每组至少 20/30 人”门槛。
3. **方差齐性是经典 ANOVA 的条件**：查看组内 SD、残差图和 Levene/Brown–Forsythe 等诊断。方差不齐且样本量不平衡时，优先考虑 Welch ANOVA；它只改变总体检验，不会自动给出合适的事后比较。
4. **缺失与离群点要可追溯**：先核对录入和预先定义的排除规则，再报告排除数量。不能为了让 F 显著而事后删除一个点。

### Welch、Student 与事后比较怎么选

- 方差和样本量大致平衡、残差没有明显问题：经典 ANOVA + Tukey HSD 是一个可解释的起点。
- 方差明显不同或组大小很不平衡：总体检验用 Welch ANOVA；两两比较可用 Games–Howell，并报告调整后的 p 值和均值差置信区间。
- 只关心每个处理组与一个对照：预先计划的 Dunnett 对比通常比做全部两两比较更有针对性。
- 只有少数预先声明的线性对比：直接报告对比估计和相应的校正；不要把“总体 F 显著”当作所有计划对比的前置门槛。
- Bonferroni/Sidak 可以控制一组预先定义比较的 FWER，但比较很多时会降低功效；探索性的一组结果若改用 FDR，应明确它控制的不是同一个错误率。

“三次 t 检验有 14% 假阳性”只在检验独立时才由 $1-(1-.05)^3$ 得到；成对比较通常相关，因此这个数字不是普遍精确值。核心问题是多重性，解决办法是总体 F 检验、计划对比或明确的多重校正。

## 四、单因素示例：情绪启动与创造力

下面是一个**教学模拟**：三种情绪启动条件，每组 30 人，DV 是 0–10 分的创造力测验。代码固定随机种子，并从同一张长表完成总体检验、Tukey 比较和效应量计算；实际研究应替换为自己的数据并保存版本。

```python
import numpy as np
import pandas as pd
import statsmodels.api as sm
from statsmodels.formula.api import ols
from statsmodels.stats.multicomp import pairwise_tukeyhsd

rng = np.random.default_rng(20260825)
spec = [("positive", 7.20, 1.50), ("neutral", 6.10, 1.40), ("negative", 5.80, 1.60)]
rows = []
for emotion, mean, sd in spec:
    z = rng.normal(size=30)
    x = mean + sd * (z - z.mean()) / z.std(ddof=1)
    rows.extend({"emotion": emotion, "creativity": value} for value in x)
df = pd.DataFrame(rows)

model = ols("creativity ~ C(emotion)", data=df).fit()
table = sm.stats.anova_lm(model, typ=2)
effect = table.loc["C(emotion)"]
error = table.loc["Residual"]
ms_error = error["sum_sq"] / error["df"]
eta2 = effect["sum_sq"] / table["sum_sq"].sum()
omega2 = (effect["sum_sq"] - effect["df"] * ms_error) / (
    table["sum_sq"].sum() + ms_error
)
posthoc = pairwise_tukeyhsd(df["creativity"], df["emotion"])

print(df.groupby("emotion")["creativity"].agg(["count", "mean", "std"]).round(2))
print(f"F({effect['df']:.0f}, {error['df']:.0f}) = {effect['F']:.2f}, p = {effect['PR(>F)']:.4g}")
print(f"eta2 = {eta2:.3f}, omega2 = {omega2:.3f}")
print(posthoc)
```

在 `statsmodels 0.14.6`、NumPy 2.5.2、pandas 3.0.5 下运行，得到的关键结果是：三组（negative/neutral/positive）的均值分别为 5.80/6.10/7.20，SD 为 1.60/1.40/1.50；$F(2,87)=7.22$，$p=.0013$，$\eta^2=.142$，$\omega^2=.121$。Tukey 的调整后结果为 positive − neutral = 1.10，95% CI [0.18, 2.02]，$p=.0155$；positive − negative = 1.40，95% CI [0.48, 2.32]，$p=.0015$；neutral − negative = 0.30，95% CI [-0.62, 1.22]，$p=.7202$。这是固定种子下的教学输出，不是心理学效应的先验保证；换数据或软件版本应重新运行。

阅读自己的输出时按以下顺序：

1. 先看每组 `n`、均值、SD 和原始点图，确认编码与缺失；
2. 再看总体 F 或 Welch F 的 df、p 和效应量；
3. 最后看预先计划的对比或 Tukey/Games–Howell 表：均值差、95% CI、调整后的 p 值，而不是只看“显著/不显著”。

单因素效应量常用：

$$
\eta^2=\frac{SS_{\text{effect}}}{SS_{\text{total}}},\qquad
\omega^2=\frac{SS_{\text{effect}}-df_{\text{effect}}MS_{\text{error}}}{SS_{\text{total}}+MS_{\text{error}}}
$$

$\eta^2$ 在样本有限时往往偏大；$\omega^2$ 是常用的偏差修正估计。不要把 Cohen 的小/中/大标尺当成领域结论，优先结合量表单位、置信区间和相近研究解释实际意义。

## 五、双因素 ANOVA：交互决定如何讲故事

以“威胁框架（威胁/无威胁）× 性别（女/男）→ 数学成绩”为例，模型包含两个主效应和一个交互项：

$$
Y=\beta_0+\beta_A A+\beta_B B+\beta_{AB}(A\times B)+\varepsilon
$$

交互检验的是“一个因素的差异是否随另一个因素水平改变”。两条均值线不平行是有用的可视线索，但正式判断仍看交互项的估计、CI 和检验。若交互值得解释：

1. 按理论预先指定的方向做简单效应或边际均值对比；
2. 为多次简单效应设定 Holm、Bonferroni 或其他预先说明的校正；
3. 报告每个条件的均值/CI 和对比，而不是只说“主效应被交互吞掉”。

Python（`statsmodels` 0.14.6 文档，核查于 2026-08-25）的最小模型写法：

```python
from statsmodels.formula.api import ols
from statsmodels.stats.anova import anova_lm

model = ols("math_score ~ C(threat) * C(gender)", data=df).fit()
anova_lm(model, typ=2)  # 平衡设计常用；不平衡时先写明平方和与对比编码
```

Type I SS 按项进入模型的顺序计算；Type II 适合没有交互或把交互作为非目标项的情形；Type III 检验在控制其他项（含交互）后的效应，且必须明确对比编码。SPSS GLM 常以 Type III 为默认，但这不是“更保守”或所有问题的通用最佳选择；在 Python/R 中使用 Type III 时，把对比编码和截距写进分析计划。

## 六、重复测量、混合设计与 ANCOVA 的边界

- 三个以上被试内水平的经典重复测量 ANOVA 需要关注球形性；违反时可报告 Greenhouse–Geisser/Huynh–Feldt 校正，或直接使用能处理不规则时间和缺失的混合效应模型。
- 混合设计同时有被试间和被试内因素。若每位被试的观测次数不等、时间间隔不齐或缺失明显，混合效应模型通常比删掉整行更合适（见 [3.6](./multilevel)）。
- ANCOVA 的协变量应在处理前测量，和结果近似线性相关，并检查各组回归斜率是否相同。后处理变量可能是处理影响的中介或碰撞变量，控制它会改变目标问题；在非随机分组中，ANCOVA 也不能把未测混淆“抹掉”。

SPSS 菜单名称会随版本略变（核查日 2026-08-25）：

```text
Analyze → General Linear Model → Univariate
  Fixed Factor(s): group
  Covariate(s): pretest       # 仅当 pretest 是处理前变量
  Options: Descriptive statistics, Estimates of effect size
```

对应语法示例：

```text
UNIANOVA posttest BY group WITH pretest
  /METHOD=SSTYPE(2)
  /PRINT=DESCRIPTIVE ETASQ
  /EMMEANS=TABLES(group) WITH(pretest=MEAN) COMPARE(group) ADJ(HOLM)
  /DESIGN=pretest group.
```

若研究问题是“斜率是否因组而异”，先拟合 `pretest*group`，不要把显著交互硬塞进一个没有斜率同质假设的 ANCOVA。

## 七、SPSS / Python 操作清单

### SPSS

1. 用 `Analyze → Descriptive Statistics → Explore` 检查各组 n、箱线图和 Q–Q 图。
2. 独立组：`Analyze → Compare Means → One-Way ANOVA`；需要时勾选 Welch，并只选择与研究问题对应的事后比较。
3. 双因素：`Analyze → General Linear Model → Univariate`，在 `Model` 确认交互项，在 `Plots` 生成 profile plot，在 `Options` 保存边际均值和效应量。
4. 保存 `.sav`、语法、输出和 SPSS 版本；导出表格前核对因子编码、有效样本数和 CI。

### Python

- `statsmodels`：公式模型、ANOVA 表和 Tukey；适合把设计写进可复现脚本。
- `pingouin`：可提供 Welch ANOVA、Games–Howell 和效应量；运行前核对当前 API 与版本。
- 画原始点和均值/CI 图；不要只导出柱状图。图形用于发现离群点、缺失和交互方向，不能替代模型检验。

## 八、常见结果信号与排错

| 信号 | 先核对 | 下一步 |
| --- | --- | --- |
| F 显著但不知道哪组不同 | 总体检验的零假设只说“至少一组不同” | 运行预先计划对比或合适的事后比较 |
| Welch F 显著、经典 F 不显著 | 方差/样本量不平衡 | 报告为何选 Welch，不挑显著的那个 |
| 交互显著 | 条件均值、简单效应和校正 | 不用平均主效应替代条件比较 |
| 结果对一个点很敏感 | 原始点、录入和排除规则 | 做透明的敏感性分析，不能事后删点 |
| 配对/重复测量 n 变少 | ID 匹配和缺失模式 | 改用重复测量模型或混合模型 |
| ANCOVA 结果方向改变 | 协变量是否为处理后变量、斜率是否同质 | 重新定义因果问题并报告模型边界 |

## 九、报告模板

> 单因素 ANOVA 显示，情绪条件对创造力的总体差异为 _F_(2, 87) = …，_p_ = …，$\eta^2$ = …，95% CI …。Tukey（或 Games–Howell）比较显示，积极组 − 中性组的均值差为 …，95% CI […]，调整后 _p_ = …。各组 _M_、_SD_ 和有效 _n_ 见表 …。该结果在随机分配且操纵/缺失处理符合设计的前提下支持条件间差异；观察性数据只能写成关联。

双因素报告还要写清因素水平、交互项、简单效应的对比方向和校正方法。ANCOVA 报告协变量、调整均值（estimated marginal means）、斜率检查、效应量和 CI；不要只报告“控制了基线所以更准确”。

## 资源与工具

<ResourceGrid :min="220">
  <ResourceCard
    name="statsmodels ANOVA"
    desc="公式模型、ANOVA 表与平方和说明（核查 0.14.6）"
    href="https://www.statsmodels.org/stable/anova.html"
    icon="P"
  />
  <ResourceCard
    name="statsmodels Tukey HSD"
    desc="多重两两比较的官方 API"
    href="https://www.statsmodels.org/stable/generated/statsmodels.stats.multicomp.pairwise_tukeyhsd.html"
    icon="P"
  />
  <ResourceCard
    name="Pingouin"
    desc="Welch、Games–Howell 与效应量；先核对当前版本"
    href="https://pingouin-stats.org/"
    icon="P"
  />
  <ResourceCard
    name="IBM SPSS Statistics 文档"
    desc="GLM/ANOVA 菜单与语法会随版本变化"
    href="https://www.ibm.com/docs/en/spss-statistics"
    icon="S"
  />
</ResourceGrid>

## 延伸阅读

- Maxwell, S. E., Delaney, H. D., & Kelley, K. (2017). *Designing experiments and analyzing data: A model comparison perspective*. Routledge. [https://doi.org/10.4324/9781315642956](https://doi.org/10.4324/9781315642956) ——均值比较、因子设计与 ANCOVA 的主干教材。
- Lakens, D. (2013). Calculating and reporting effect sizes to facilitate cumulative science: A practical primer for t-tests and ANOVAs. *Frontiers in Psychology, 4*, 863. [https://doi.org/10.3389/fpsyg.2013.00863](https://doi.org/10.3389/fpsyg.2013.00863) ——效应量定义、换算与报告。
- Appelbaum, M., Cooper, H., Kline, R. B., Mayo-Wilson, E., Nezu, A. M., & Rao, S. M. (2018). Journal article reporting standards for quantitative research in psychology: The APA Publications and Communications Board task force report. *American Psychologist, 73*(1), 3–25. [https://doi.org/10.1037/amp0000191](https://doi.org/10.1037/amp0000191) ——报告估计值、不确定性、模型与设计边界。
