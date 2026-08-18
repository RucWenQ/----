---
title: 3.2.1 独立样本 t 检验
description: 从信号 / 噪声的直觉到 SPSS 与 Python 实现，并讲清方差齐性与不齐时怎么读结果
---

# 3.2.1 独立样本 t 检验

::: tip 本节目标

读完本节后你能：

- 用一句话说清 **t 检验在算什么**——为什么是均值差除以一个东西。
- 区分 **Student's t**（假设方差齐）与 **Welch's t**（不假设方差齐），并知道现代推荐默认用哪个。
- 在 SPSS 和 Python 中跑出独立样本 t 检验，正确读出 Levene's test 之后该看哪一行。
- 写一段符合 APA 7 的结果报告，包含 _t_、_df_、_p_、Cohen's _d_、95% CI。
- 判断什么时候**不该**用独立样本 t 检验，并知道替代方案是什么。

:::

<OutlineCard title="本节路线图">

- t 检验在干什么：从信号 / 噪声开始
- 用之前要先问的三件事
- 一个完整例子：Cyberball 社会排斥
- SPSS 实现与输出解读
- Python 实现（scipy / pingouin）
- APA 报告模板
- 常见错误与替代方案

</OutlineCard>

## 一、独立样本 t 检验在干什么

### 1. 一句话定义

把 **两组互不相关** 的被试，在 **同一个连续因变量** 上的均值做对比，看这个差异是不是大到不像随机波动产生的。

### 2. 直觉版：信号除以噪声

t 值的本质就是一个**信噪比**：

$$
t = \frac{\text{两组均值之差}}{\text{这个差异在抽样下能漂多远}} = \frac{M_1 - M_2}{SE_{\text{diff}}}
$$

- **分子（信号）**：你观察到的两组均值差。它越大，说明组间差异越明显。
- **分母（噪声）**：如果这两组其实没差异，光因为"我们碰巧抽到的是这 60 个人"，均值差也会随机漂——这个分母衡量的就是这种漂移幅度。
- **比值大** → 观察到的差异远超抽样能解释的随机漂移 → 拒绝"两组没差异"的零假设。
- **比值小** → 观察到的差异跟随机漂移差不多大 → 不能拒绝零假设。

::: tip 一个生活化的类比
两个班的平均分差了 5 分。这 5 分到底是真实差距，还是只是"今天考试运气不一样"？

- 如果两个班内部的成绩波动很小（每个学生都接近班级均值），那 5 分的差距就很显眼——**信号大、噪声小**。
- 如果两个班内部本来就上下飘 30 分（学渣学霸都有），那 5 分的均值差就完全可能是抽样运气——**信号小、噪声大**。

t 检验就是把这个直觉算成一个数。
:::

### 3. 公式（两个版本）

**Student's t-test**（假设两组方差相等）：

$$
t = \frac{M_1 - M_2}{\sqrt{s_p^2 \left(\frac{1}{n_1}+\frac{1}{n_2}\right)}}, \qquad
s_p^2 = \frac{(n_1-1)s_1^2 + (n_2-1)s_2^2}{n_1+n_2-2}
$$

自由度 $df = n_1 + n_2 - 2$。

**Welch's t-test**（不假设方差相等，各用各的方差）：

$$
t = \frac{M_1 - M_2}{\sqrt{\frac{s_1^2}{n_1}+\frac{s_2^2}{n_2}}}
$$

自由度由 Welch–Satterthwaite 公式近似（通常不是整数）。

::: tip 现代推荐：默认用 Welch's
Delacre, Lakens 与 Leys（2017）的模拟研究显示：<span class="kw">Welch's t-test 在方差相等时几乎不损失功效，在方差不等时大幅减少 I 类错误膨胀</span>。所以当代建议是：

- **直接默认用 Welch's**，不用先做 Levene's 检验再决定。
- SPSS 输出里会同时给两个版本，看下面那一行（Equal variances not assumed）就行。
- Python `scipy.stats.ttest_ind` 设 `equal_var=False`，这就是 Welch's。

:::

### 4. 一个隐藏的小常识：t 分布是怎么来的

::: details 为什么叫 t 检验，"Student"是谁
20 世纪初，Guinness 啤酒厂的化学家 William Sealy Gosset 要在小样本下检验麦芽质量，用正态分布算出来的 z 值在小样本时偏差很大。他推导出了 t 分布——比正态分布尾部更厚，能更准确地反映小样本下的不确定性。Guinness 不允许员工以本名发表论文，他就用笔名 "Student" 在 _Biometrika_ 上发了 1908 年的那篇文章。所以这个统计量叫 t（Gosset 写作 _t_），检验叫 **Student's t-test**。
:::

## 二、用之前要先问的三件事

### 1. 观测之间独立吗？

- 同一个人测两次（前测—后测）→ 不独立 → 用配对 t 检验
- 比较具有嵌套关系的观测，例如学校-年级-班级 → 不独立 → 用多层模型

### 2. 因变量是连续的吗？

- 连续 / 多条目李克特合成分 → 适用 t 检验
- 二分类（是/否、买/不买）→ 用卡方或 Logistic 回归
- 单条目李克特题、明显定序的 → 优先 Mann-Whitney U

### 3. 样本量合适吗？

- **每组 n ≥ 30**：中心极限定理保护下，t 检验对正态偏离非常稳健
- **每组 n < 30**：要看一下分布。极端偏态（反应时、收入这种右偏到天上的）→ 先做对数变换或使用 Mann-Whitney U。
- **极端异常值**：t 检验用均值和 SD，对异常值很敏感。先做箱线图看看数据分布。

方差齐性（homogeneity of variance）传统上也是一个假设，但**现代用 Welch's 之后不用额外讨论这一点**。

## 三、一个完整例子：Cyberball 社会排斥

### 研究背景

Williams（2007 综述）的 **Cyberball 范式** 是社心方向操作"社会排斥"的标准方法。被试以为自己在和另外两个真人玩网络抛接球游戏，实际上对方是程序控制的。

- **被纳入条件**（included）：球被均匀地抛给三个人。
- **被排斥条件**（excluded）：开局两轮后，对方两个"人"开始只在彼此之间传球，再不传给被试。

DV 是排斥后的**需求威胁分**（need-threat score，自尊+归属感+控制感+意义感的合成分，分数越高表示需求越被满足）。

理论预期：被排斥组的需求威胁分应该显著低于被纳入组。

### 假设虚拟数据

| 组别   | n   | M    | SD   |
| ------ | --- | ---- | ---- |
| 被纳入 | 30  | 4.32 | 0.81 |
| 被排斥 | 30  | 2.95 | 0.94 |

### 手算演示（仅为理解原理）

**Student's t**：

$$
s_p^2 = \frac{29 \times 0.81^2 + 29 \times 0.94^2}{58} \approx 0.77
$$

$$
SE_{\text{diff}} = \sqrt{0.77 \times \left(\tfrac{1}{30}+\tfrac{1}{30}\right)} \approx 0.226
$$

$$
t = \frac{4.32 - 2.95}{0.226} \approx 6.06, \quad df = 58, \quad p < .001
$$

**Cohen's d**：

$$
d = \frac{M_1 - M_2}{s_p} = \frac{1.37}{\sqrt{0.77}} \approx 1.56
$$

这是一个非常大的效应量——Cyberball 范式本身在文献里效应也确实很大，符合预期。

## 四、SPSS 实现

### 1. 菜单操作

`Analyze → Compare Means → Independent-Samples T Test`

- **Test Variable(s)**：拖入 DV（need_threat）
- **Grouping Variable**：拖入分组变量（condition），点 **Define Groups** 输入两组的编码（比如 1 = included, 2 = excluded）

### 2. 等价语法

```bash
T-TEST GROUPS=condition(1 2)
  /MISSING=ANALYSIS
  /VARIABLES=need_threat
  /CRITERIA=CI(.95).
```

### 3. 输出怎么看

SPSS 会输出**两块表**：

**第一块：Group Statistics**——各组的 _n_、_M_、_SD_、_SE_M_。先看一下两组人数是不是预期的、均值方向对不对。

**第二块：Independent Samples Test**——核心表。它的列结构是：

| 列名                     | 内容                  | 关注什么             |
| ------------------------ | --------------------- | -------------------- |
| Levene's F, Sig.         | 方差齐性检验          | 决定看下一行的哪一格 |
| t, df, Sig.(2-tailed)    | t 检验本身            | 主要结果             |
| Mean Difference          | $M_1 - M_2$           | 方向 + 大小          |
| Std. Error Difference    | $SE_{\text{diff}}$    | 用来算 CI            |
| 95% CI of the Difference | 均值差的 95% 置信区间 | 重点看是否过 0       |

第二块表会有**两行**：

- **Equal variances assumed**（假设方差齐）= Student's t
- **Equal variances not assumed**（假设方差不齐）= Welch's t

### 4. 怎么决定看哪一行

::: code-group

```text [传统流程（教材主流）]
Levene's p > .05 → 看 "Equal variances assumed"（Student's t）
Levene's p < .05 → 看 "Equal variances not assumed"（Welch's t）
```

```text [现代推荐]
不论 Levene's 显著与否
→ 直接看 "Equal variances not assumed"（Welch's t）
```

:::

::: warning 一个值得注意的细节
SPSS 输出里 Welch's t 的自由度（df）通常**不是整数**——比如 t(53.42)。这是 Welch–Satterthwaite 近似的特征，写报告时保留 1–2 位小数即可。
:::

## 五、Python 实现

### 1. scipy（最基本，只给 t 和 p）

```python
from scipy import stats
import pandas as pd

df = pd.read_csv("cyberball.csv")
inc = df.loc[df["condition"] == "included", "need_threat"]
exc = df.loc[df["condition"] == "excluded", "need_threat"]

# Welch's t-test（推荐默认）
t, p = stats.ttest_ind(inc, exc, equal_var=False)

# Student's t-test（假设方差齐）
t_stu, p_stu = stats.ttest_ind(inc, exc, equal_var=True)

# 注：scipy 不直接给 Cohen's d 和 CI
```

### 2. pingouin（推荐，一行 APA 全量输出）

```python
import pingouin as pg

result = pg.ttest(inc, exc, paired=False, correction="auto")
print(result)
```

输出是一个 DataFrame，包含：

- `T`：t 值
- `dof`：自由度
- `p-val`：p 值
- `CI95%`：均值差的 95% CI
- `cohen-d`：Cohen's d 效应量
- `BF10`：贝叶斯因子（与零假设的相对支持）
- `power`：事后功效

`correction` 参数：

- `"auto"`：Levene's 显著时自动转 Welch's（传统流程）
- `True`：强制 Welch's（现代推荐）
- `False`：强制 Student's

### 3. 顺手做的几个检查

```python
# 方差齐性检验（Levene's）
stats.levene(inc, exc, center="median")  # 推荐用 median 版本，对正态偏离更稳健
# 或用 pingouin
pg.homoscedasticity(data=df, dv="need_threat", group="condition")

# 正态性检验（Shapiro-Wilk，仅小样本时参考）
stats.shapiro(inc)
stats.shapiro(exc)

# 可视化（建议先做）
import seaborn as sns
sns.boxplot(data=df, x="condition", y="need_threat")
```

### 4. 数据格式提醒

`pg.ttest()` 的两种输入方式：

```python
# 方式 1：传入两组 Series
pg.ttest(inc, exc)

# 方式 2：传入长格式数据（不可以！pg.ttest 不支持 between 参数）
# 长格式应改用 pg.pairwise_tests 或自己切分
```

## 六、APA 报告模板

### 文字段落

> 独立样本 _t_ 检验显示，被排斥组（_M_ = 2.95, _SD_ = 0.94）的需求威胁得分显著低于被纳入组（_M_ = 4.32, _SD_ = 0.81），_t_(53.42) = –6.06, _p_ < .001, Cohen's _d_ = 1.56, 95% CI for mean difference [0.92, 1.82]。这一结果与 Cyberball 范式既有发现一致，社会排斥显著降低个体的基本需求满足感。

### 拆解每个数字

| 写什么            | 怎么算 / 哪里来              |
| ----------------- | ---------------------------- |
| _M_ (_SD_) 各一对 | Group Statistics 表          |
| _t_(_df_)         | 注意 Welch's 的 df 是非整数  |
| _p_               | < .001 不写 = .000           |
| Cohen's _d_       | pingouin 直接给              |
| 95% CI            | 是均值差的 CI，过 0 = 不显著 |

### 写作规范

::: danger 这些写法会被审稿人指出来

- 写 _p_ = .000 → 改成 _p_ < .001
- 只报 _t_ 和 _p_ 不报 _d_ → APA 7 要求必报效应量
- 把"不显著"写成"无差异"或"两组相等"→ 不显著只是没拒绝零假设，不是接受零假设
- 不写置信区间 → 越来越多期刊把 CI 列为必报项
- d > 1 还轻描淡写"中等效应量" → Cohen 的标尺是参考，d > 0.8 就是大
  :::

## 七、常见错误清单

::: danger 五个最高频的坑

1. **非独立样本**：同一个人前测后测扔进独立样本 t 检验。这种数据应该用配对 t 检验。
2. **三组以上做两两 t 检验**：3 组应该用 ANOVA + 事后比较（Tukey HSD / Bonferroni）。
3. **方差严重不齐还硬用 Student's**：分组样本量不等且方差不等时，Student's t 的 I 类错误率可能严重偏离 .05。Welch's 就不存在这个问题。
4. **效应量缺失**：只报 _t_ 和 _p_ 而不报 Cohen's _d_ 和 CI。
5. **以为不显著 = 没差异**：_n_ 太小时 _p_ > .05 可能只是功效不够。<span class="kw">想说"两组相等"，应该用等价性检验（TOST）而不是 t 检验</span>。
   :::

## 八、什么时候不该用独立样本 t 检验

| 研究设计                       | 替代方案                                       |
| ------------------------------ | ---------------------------------------------- |
| 同一个人多次测量               | 配对 t 检验 / 重复测量 ANOVA                   |
| 三组及以上                     | 单因素 ANOVA（[3.2.2](./anova)）               |
| 二分类 DV                      | 卡方检验（[3.3](./chi-square)）/ Logistic 回归 |
| 严重偏态 + 小样本              | Mann-Whitney U                                 |
| 想检验"两组相等"而非"两组不同" | 等价性检验（TOST）                             |
| 嵌套 / 多层数据                | 多层线性模型（[3.6](./multilevel)）            |
| 想同时分析多个 DV              | MANOVA（[3.2.3](./manova)）                    |

## 资源与工具

<ResourceGrid :min="220">
  <ResourceCard
    name="pingouin"
    desc="Python 心理学统计包 · t 检验默认输出 d 和 CI"
    href="https://pingouin-stats.org/build/html/generated/pingouin.ttest.html"
    icon="🐧"
  />
  <ResourceCard
    name="JASP"
    desc="开源软件 · 同时给频率派和贝叶斯 t 检验"
    href="https://jasp-stats.org/"
    icon="🧮"
  />
  <ResourceCard
    name="effectsize (R)"
    desc="一行算 Cohen's d / Hedges' g 及其 CI"
    href="https://easystats.github.io/effectsize/"
    icon="📏"
  />
  <ResourceCard
    name="TOSTER (R/Shiny)"
    desc="等价性检验工具 · 用来证'两组相等'"
    href="https://aaroncaldwell.us/TOSTERpkg/"
    icon="⚖️"
  />
</ResourceGrid>

## 延伸阅读

- Student. (1908). The probable error of a mean. _Biometrika, 6_(1), 1–25. ——t 检验诞生的论文，Gosset 用 "Student" 笔名发表。
- Delacre, M., Lakens, D., & Leys, C. (2017). Why psychologists should by default use Welch's t-test instead of Student's t-test. _International Review of Social Psychology, 30_(1), 92–101. ——为什么默认应该用 Welch's。
- Lakens, D. (2013). Calculating and reporting effect sizes to facilitate cumulative science. _Frontiers in Psychology, 4_, 863. ——Cohen's _d_ / Hedges' _g_ 的计算与报告标准。
- Williams, K. D. (2007). Ostracism. _Annual Review of Psychology, 58_, 425–452. ——Cyberball 范式综述，本节例子的出处。
- Lakens, D., Scheel, A. M., & Isager, P. M. (2018). Equivalence testing for psychological research: A tutorial. _Advances in Methods and Practices in Psychological Science, 1_(2), 259–269. ——等价性检验入门。
