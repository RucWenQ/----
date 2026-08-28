---
title: 3.2.1 t 检验
description: 先分清独立、配对与单样本，再用 SPSS 或 Python 完成检验、解释区间与效应量
---

# 3.2.1 t 检验

::: tip 本节目标

遇到“两个均值要不要比较”时，你能先按观测结构选对 t 检验，再完成数据检查、软件操作、结果解释与报告，而不是只盯着一个 p 值。

:::

<OutlineCard title="先回答三个问题">

1. 你比较的是两个独立组、同一批人的两次测量，还是一个样本与参考值？
2. 每一行代表谁，哪些数值来自同一个人或同一对？
3. 你要报告的均值差、置信区间和效应量，方向是否一致？

</OutlineCard>

## 一、先选对：不是“两个均值”就用同一种 t 检验

| 你的研究问题 | 观测结构 | 方法 | Python |
| --- | --- | --- | --- |
| 排斥组与纳入组的需求满足分是否不同？ | 两组不同被试，每人一个分数 | **独立样本 t 检验**，通常默认 Welch | `stats.ttest_ind(..., equal_var=False)` |
| 同一批学生考试前后的焦虑是否变化？ | 每人两个分数，一一对应 | **配对 t 检验** | `stats.ttest_rel(post, pre)` |
| 一组学生的平均变化是否不同于 0？ | 每人一个变化分 | **单样本 t 检验** | `stats.ttest_1samp(change, popmean=0)` |

配对 t 检验其实就是先算每个人的差值，再检验**平均差值是否为 0**。因此，“前测 30 人、后测另 30 人”不是配对设计；“夫妻两人的分数”只有在每对关系明确、研究问题确实是角色间均值差时，才可转成配对差值。

::: warning 这些情况先不要套 t 检验

- 三个及以上条件：进入 [ANOVA](./anova)，或对预先规定的少量对比做多重性控制。
- 二分类结果：考虑 [卡方检验](./chi-square) 或 Logistic 回归。
- 学生嵌套在班级、同一人有很多次测量：考虑 [多层 / 混合效应模型](./multilevel)。
- 想证明“两组足够接近”：普通 t 检验不回答这个问题，应预先定义最小重要差异并做等价性检验。

:::

## 二、独立两组：为什么通常直接用 Welch t 检验

独立样本 t 检验把观察到的均值差与它的标准误比较：

$$
t = \frac{\bar X_1-\bar X_2}{SE(\bar X_1-\bar X_2)}
$$

若不假定两组方差相等，Welch t 检验使用：

$$
SE(\bar X_1-\bar X_2)=\sqrt{\frac{s_1^2}{n_1}+\frac{s_2^2}{n_2}}
$$

它的自由度由 Welch-Satterthwaite 公式近似，所以常出现小数。Student t 检验则合并两组方差，并使用 $df=n_1+n_2-2$。当两组方差或样本量不同，先用 Levene 检验决定版本会把一次分析变成不稳定的两阶段决策；Delacre、Lakens 与 Leys（2017）因此建议心理学研究默认使用 Welch。

<span class="kw">Welch 只放宽“方差相等”这一条件，不会修复非独立观测、极端异常值、错误的数据编码或有偏抽样。</span>

### 开始前检查什么

1. **独立性**：一个人只能属于一个组；成对、重复或嵌套数据不能当成独立个体。
2. **结果变量**：通常是有实质连续意义的量表总分、反应时或测量值。不要只因变量写成数字就当作连续。
3. **分布与异常值**：分别查看两组的原始数据、箱线图或 Q-Q 图。稳健程度取决于偏态、尾部、异常值和样本量是否平衡，没有“每组达到 30 就自动安全”的通用门槛。
4. **推断范围**：随机抽样支持向目标总体推广；随机分配与良好执行的实验设计才支持因果措辞。t 检验本身不会创造这些条件。

::: warning 不要看到 Shapiro-Wilk 显著就自动换方法

大样本下，轻微偏离也可能得到很小的 p 值；小样本下，严重偏离又可能检不出来。先看图和异常值，再结合设计与样本量判断。Mann-Whitney U 检验比较的是分布位置或随机优势；只有在额外的分布形状条件下，才能把它简化解释成“中位数检验”。

:::

## 三、贯穿例子：社会排斥是否降低需求满足

这是**教学用模拟实验**。60 名被试被随机分到 Cyberball 纳入条件或排斥条件，结果变量为基本需求满足分，分数越高表示满足程度越高。

| 条件 | n | M | SD |
| --- | ---: | ---: | ---: |
| 纳入 | 30 | 4.32 | 0.81 |
| 排斥 | 30 | 2.95 | 0.94 |

最短分析路径是：确认分组编码与缺失值，检查两组分布，运行 Welch t 检验，读取“纳入减排斥”的均值差及其 95% CI，最后报告未标准化差异和效应量。

### Python：从固定模拟数据到可导出的结果

以下代码核查于 2026-08-25，使用 Python 3.12.13、NumPy 2.5.2、pandas 3.0.5 与 SciPy 1.18.1。它先生成固定模拟数据；分析自己的数据时，把生成数据的部分换成 `pd.read_csv()` 即可。

```python
import numpy as np
import pandas as pd
import scipy
from scipy import stats

rng = np.random.default_rng(20260825)

def rescale(x, mean, sd):
    """把模拟值缩放到指定的样本均值和样本标准差。"""
    return mean + sd * (x - x.mean()) / x.std(ddof=1)

included = rescale(rng.normal(size=30), 4.32, 0.81)
excluded = rescale(rng.normal(size=30), 2.95, 0.94)

df = pd.DataFrame({
    "condition": ["included"] * 30 + ["excluded"] * 30,
    "condition_code": [1] * 30 + [2] * 30,
    "need_satisfaction": np.r_[included, excluded],
})

# 先核对组别、人数、均值、标准差和缺失值
summary = df.groupby("condition")["need_satisfaction"].agg(
    n="count", mean="mean", sd="std"
)
assert df["need_satisfaction"].notna().all()
assert set(df["condition"]) == {"included", "excluded"}
assert set(df["condition_code"]) == {1, 2}

# 纳入组减排斥组：顺序决定 t、均值差和区间的正负号
welch = stats.ttest_ind(included, excluded, equal_var=False)
ci = welch.confidence_interval(confidence_level=0.95)
mean_difference = included.mean() - excluded.mean()

# 常用的标准化效应量；异方差明显时应优先解释原始单位的均值差
n1, n2 = included.size, excluded.size
pooled_sd = np.sqrt(
    ((n1 - 1) * included.var(ddof=1) + (n2 - 1) * excluded.var(ddof=1))
    / (n1 + n2 - 2)
)
cohen_d = mean_difference / pooled_sd
hedges_g = cohen_d * (1 - 3 / (4 * (n1 + n2 - 2) - 1))

print(f"SciPy {scipy.__version__}")
print(summary.round(2))
print(f"Welch t({welch.df:.2f}) = {welch.statistic:.2f}, p = {welch.pvalue:.3g}")
print(f"mean difference = {mean_difference:.2f}, 95% CI [{ci.low:.2f}, {ci.high:.2f}]")
print(f"Cohen d = {cohen_d:.2f}, Hedges g = {hedges_g:.2f}")

result = pd.DataFrame([{
    "contrast": "included - excluded",
    "mean_difference": mean_difference,
    "ci_low": ci.low,
    "ci_high": ci.high,
    "t": welch.statistic,
    "df": welch.df,
    "p": welch.pvalue,
    "cohen_d": cohen_d,
    "hedges_g": hedges_g,
}])
df.to_csv("cyberball_tutorial.csv", index=False)
result.to_csv("cyberball_welch_result.csv", index=False)
```

核对输出：

```text
SciPy 1.18.1
             n  mean    sd
condition
excluded    30  2.95  0.94
included    30  4.32  0.81
Welch t(56.76) = 6.05, p = 1.22e-07
mean difference = 1.37, 95% CI [0.92, 1.82]
Cohen d = 1.56, Hedges g = 1.54
```

### 结果怎么读

- **方向**：代码算的是“纳入减排斥”，所以 t、均值差和区间都是正数。调换输入顺序后，它们会变成负数，但双侧 p 值不变。
- **大小与不确定性**：纳入组平均高 1.37 分；与数据和模型相容的总体均值差范围约为 0.92 至 1.82 分。
- **标准化效应量**：Hedges g = 1.54。不要只贴“小/中/大”标签；先解释 1.37 个原始量表单位是否有实质意义，再与同领域研究比较。
- **因果边界**：在随机分配、操纵执行和缺失处理都合理的前提下，这个模拟实验可表述为“排斥条件降低了需求满足”。若数据来自自然分组或横断问卷，只能说两组得分不同或条件与得分相关。

### SPSS：同一个问题怎么做

1. 数据使用长格式：一列 `condition_code`（1 = 纳入，2 = 排斥），一列 `need_satisfaction`，每行一名被试。示例 CSV 另保留 `condition` 文字标签，便于核对编码。
2. 先运行 `Analyze → Descriptive Statistics → Explore`。把得分放入 Dependent List、条件放入 Factor List，查看人数、缺失、箱线图和 Q-Q 图。
3. 运行 `Analyze → Compare Means → Independent-Samples T Test`，指定结果变量与两组编码。
4. 在输出中先核对 Group Statistics；正式结果读取 **Equal variances not assumed** 行。新版界面的双侧 p 值可能显示为 `Two-Sided p`，旧版常写 `Sig. (2-tailed)`。
5. 报告 Mean Difference 及其 95% CI。若当前版本不提供标准化效应量，可用上面的 Python 代码或其他经过核验的软件计算，并写清效应量定义。
6. 在 Output Viewer 用 `File → Export` 导出 PDF/Word；同时保存 `.sav`、语法和软件版本，避免只留下截图。

对应语法：

```text
T-TEST GROUPS=condition_code(1 2)
  /MISSING=ANALYSIS
  /VARIABLES=need_satisfaction
  /CRITERIA=CI(.95).
```

SPSS 同时给出 Student 与 Welch 两行。不要把 Levene p 值当成“先过门槛才能分析”；若分析计划默认 Welch，就始终读取不假定方差相等的一行。

## 四、配对数据：分析的是每个人的差值

假设 24 名学生在考试前后各完成一次焦虑量表。研究问题是“后测减前测的平均变化是否为 0”，而不是把两列当成两个独立组。

### Python：配对 t 与单样本 t 应得到同一个结果

```python
import numpy as np
import pandas as pd
from scipy import stats

rng = np.random.default_rng(20260825)

def rescale(x, mean, sd):
    return mean + sd * (x - x.mean()) / x.std(ddof=1)

pre = rescale(rng.normal(size=24), 4.10, 0.75)
change = rescale(rng.normal(size=24), -0.60, 0.80)
post = pre + change

df_paired = pd.DataFrame({
    "id": np.arange(1, 25),
    "anxiety_pre": pre,
    "anxiety_post": post,
})

paired = stats.ttest_rel(post, pre)       # 后测减前测
same_test = stats.ttest_1samp(change, 0)  # 对差值做单样本 t
ci = paired.confidence_interval(confidence_level=0.95)
cohen_dz = change.mean() / change.std(ddof=1)

assert np.allclose(paired.statistic, same_test.statistic)
assert df_paired[["anxiety_pre", "anxiety_post"]].notna().all().all()

print(df_paired[["anxiety_pre", "anxiety_post"]].agg(["mean", "std"]).round(2))
print(f"paired t({paired.df:.0f}) = {paired.statistic:.2f}, p = {paired.pvalue:.4f}")
print(f"mean change = {change.mean():.2f}, 95% CI [{ci.low:.2f}, {ci.high:.2f}]")
print(f"Cohen dz = {cohen_dz:.2f}")

df_paired.to_csv("paired_anxiety_tutorial.csv", index=False)
```

核对输出为：前测 M = 4.10、SD = 0.75；后测 M = 3.50、SD = 1.09；$t(23)=-3.67$，$p=.0013$；平均变化为 -0.60，95% CI [-0.94, -0.26]；Cohen $d_z=-0.75$。

这里需要检查的是**差值分布**和差值中的异常值，而不是要求前测、后测各自都正态。配对效应量 $d_z$ 使用差值的标准差，不能与独立样本 Cohen d 当作同一个量直接比较。

SPSS 路径为 `Analyze → Compare Means → Paired-Samples T Test`，把 `anxiety_post` 与 `anxiety_pre` 按希望的差值方向配成一对。语法如下：

```text
T-TEST PAIRS=anxiety_post WITH anxiety_pre (PAIRED)
  /CRITERIA=CI(.95).
```

::: warning 缺失值会改变有效样本

配对检验只保留两次测量都不缺失的完整配对。若失访与焦虑变化有关，简单删除可能产生偏差；有多个时间点或缺失机制更复杂时，混合效应模型通常更合适。

:::

## 五、报告时按“估计值 → 区间 → 检验 → 边界”写

独立样本例子可以写成：

> 在该教学模拟实验中，纳入组的需求满足分（M = 4.32, SD = 0.81）高于排斥组（M = 2.95, SD = 0.94）。Welch 独立样本 t 检验得到 $t(56.76)=6.05$，$p<.001$；纳入组减排斥组的均值差为 1.37，95% CI [0.92, 1.82]，Hedges $g=1.54$。

配对例子可以写成：

> 学生的焦虑分从前测（M = 4.10, SD = 0.75）下降到后测（M = 3.50, SD = 1.09），平均变化为 -0.60，95% CI [-0.94, -0.26]，$t(23)=-3.67$，$p=.001$，Cohen $d_z=-0.75$。由于该例未设置随机对照组，这个前后差异本身不能证明某项干预造成了下降。

APA 的量化研究报告规范强调效应估计和不确定性。具体期刊可能有自己的表格、效应量或小数位要求，投稿前仍要核对目标期刊说明。

## 六、结果不对时，按信号排查

| 看到的信号 | 常见原因 | 先做什么 |
| --- | --- | --- |
| t 的方向和预期相反 | 两组或前后顺序反了 | 明确写出“组 1 减组 2”或“后测减前测” |
| df 是小数 | 使用了 Welch | 正常现象，按软件输出保留约两位 |
| SPSS 两行结果不同 | 方差、样本量或标准误算法不同 | 按预先计划读取 Welch 行，不按显著性挑结果 |
| p 不显著但区间很宽 | 估计不精确，样本信息不足 | 报告区间；不要改写成“两组相等” |
| 一个点改变整个结论 | 均值与标准差受异常值影响 | 核对录入、画图，做有理由且透明的敏感性分析 |
| 配对样本数少于原始人数 | 某次测量缺失或 ID 未正确匹配 | 按 ID 检查一一对应和缺失模式 |
| 连续做很多 t 检验 | 多重比较提高假阳性风险 | 使用 ANOVA、预先计划对比或多重性校正 |

若目标是支持“差异小到可忽略”，先给出有理论或实际依据的等价界限，再使用 TOST。不要根据观察到的样本效应临时设界限。

## 资源与工具

<ResourceGrid :min="220">
  <ResourceCard
    name="SciPy t 检验文档"
    desc="ttest_ind / ttest_rel / ttest_1samp 的官方参数与返回值"
    href="https://docs.scipy.org/doc/scipy/reference/stats.html#t-tests"
    icon="P"
  />
  <ResourceCard
    name="Pingouin"
    desc="面向统计分析的 Python 包；使用前核对当前版本参数"
    href="https://pingouin-stats.org/"
    icon="P"
  />
  <ResourceCard
    name="JASP"
    desc="图形界面统计软件，可同时查看频率派与贝叶斯 t 检验"
    href="https://jasp-stats.org/"
    icon="J"
  />
  <ResourceCard
    name="TOSTER"
    desc="等价性检验的 R 包与教程"
    href="https://aaroncaldwell.us/TOSTERpkg/"
    icon="T"
  />
</ResourceGrid>

## 延伸阅读

- Cumming, G., & Calin-Jageman, R. J. (2024). _Introduction to the new statistics: Estimation, open science, and beyond_. Routledge. [https://doi.org/10.4324/9781032689470](https://doi.org/10.4324/9781032689470) ——主干章节包括独立组设计、配对设计、置信区间与效应量。
- Maxwell, S. E., Delaney, H. D., & Kelley, K. (2017). _Designing experiments and analyzing data: A model comparison perspective_. Routledge. [https://doi.org/10.4324/9781315642956](https://doi.org/10.4324/9781315642956) ——均值比较、研究设计与推断边界。
- Delacre, M., Lakens, D., & Leys, C. (2017). Why psychologists should by default use Welch's t-test instead of Student's t-test. _International Review of Social Psychology, 30_(1), 92-101. [https://doi.org/10.5334/irsp.82](https://doi.org/10.5334/irsp.82)
- Lakens, D. (2013). Calculating and reporting effect sizes to facilitate cumulative science: A practical primer for t-tests and ANOVAs. _Frontiers in Psychology, 4_, 863. [https://doi.org/10.3389/fpsyg.2013.00863](https://doi.org/10.3389/fpsyg.2013.00863)
- Appelbaum, M., Cooper, H., Kline, R. B., Mayo-Wilson, E., Nezu, A. M., & Rao, S. M. (2018). Journal article reporting standards for quantitative research in psychology: The APA Publications and Communications Board task force report. _American Psychologist, 73_(1), 3-25. [https://doi.org/10.1037/amp0000191](https://doi.org/10.1037/amp0000191)
- Lakens, D., Scheel, A. M., & Isager, P. M. (2018). Equivalence testing for psychological research: A tutorial. _Advances in Methods and Practices in Psychological Science, 1_(2), 259-269. [https://doi.org/10.1177/2515245918770963](https://doi.org/10.1177/2515245918770963)
- Williams, K. D. (2007). Ostracism. _Annual Review of Psychology, 58_, 425-452. [https://doi.org/10.1146/annurev.psych.58.110405.085641](https://doi.org/10.1146/annurev.psych.58.110405.085641)
