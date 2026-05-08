---
title: 3.1 描述性统计
description: 描述性统计的概念、心理学论文中的常用场景与三线表模板、SPSS / Python 实现，以及异常值、缺失值、正态性等进阶要点
---

# 3.1 描述性统计

::: tip 本节目标

读完本节后你能：

- 区分**描述性统计**与推论统计，根据变量类型选对指标。
- 写出心理学论文中规范的**样本特征段**和**变量描述段**，并套用三线表模板。
- 在 SPSS 和 Python 中跑出均值、标准差、偏度、峰度、相关矩阵、分组描述。
- 识别异常值、缺失数据与偏态分布，判断它们对后续分析的影响。

:::

<OutlineCard title="本节路线图">

- 概述：描述性统计是什么，为什么写论文绕不开它
- 论文场景：人口学特征表 + 变量描述/相关矩阵表 + 段落模板
- 常用方法：集中趋势、离散程度、分布形态、频次
- 软件实现：SPSS 与 Python（pandas + scipy）
- 进阶要点：异常值、缺失值、正态性、分组、可视化、APA 规范

</OutlineCard>

## 概述

**描述性统计**（descriptive statistics）是用一组数字或图形把样本数据的主要特征**总结**出来的方法。它不做"从样本推到总体"的判断，那是推论统计的任务。

为什么先讲它？因为：

1. **它是后续一切分析的前置**。t 检验要看正态性；回归要查共线性和异常值；元分析读的是别人论文里的均值和标准差。这些都依赖描述性统计先把数据"摸清楚"。
2. **它是论文里的标配**。任何一篇规范的实证心理学论文，Method 节里都有样本特征段，Results 节开头都有变量描述/相关矩阵表。<span class="kw">没写好描述性统计，审稿人会直接判断你"不熟悉学科规范"。</span>
3. **它最容易暴露问题**。一个均值远离量表中点、一个 SD 异常小、一个偏度大于 2，往往比 _p_ 值更能说明数据有问题。

描述性统计回答四类问题：**集中在哪里**（均值、中位数、众数）、**散得多开**（标准差、四分位距、范围）、**长什么样**（偏度、峰度、直方图）、**有几类各多少**（频次、百分比）。

## 心理学论文中的常用场景

社心论文里的描述性统计**几乎只出现在两个地方**：Method 节末尾的样本特征，和 Results 节开头的变量描述。写的时候可以直接套用手册里的模板。

### 场景一：报告样本人口学特征

放在 Method → Participants 部分。常见做法有两种：

- **小样本或人口学维度少**（≤ 3 个）：直接写在正文里，不做表。
- **大样本或维度多**：做一张人口学特征表，正文给一句总览。

**正文段落模板**：

> 研究共招募 _N_ = 234 名大学生被试参与，其中女性 129 人（55.1%），男性 105 人（44.9%）。被试年龄范围为 18–30 岁（_M_ = 21.4，_SD_ = 2.3）。学历分布为本科 76.9%（_n_ = 180）、硕士 17.9%（_n_ = 42）、博士 5.2%（_n_ = 12）。所有被试均为汉族，自愿参加并签署知情同意书，完成实验后获得 ¥ X 元报酬。

::: tip 写作经验

- 中文论文里习惯用 _N_ 表示总样本量、_n_ 表示子样本量，斜体。
- 百分比保留 1 位小数，与年龄、量表分均值的小数位数保持一致。
- 关键变量（性别、年龄）必报；其他维度（学历、专业、收入）按研究需要报。
  :::

**人口学特征表模板**：

| 变量 | 类别       | _n_        | %    |
| ---- | ---------- | ---------- | ---- |
| 性别 | 男         | 105        | 44.9 |
|      | 女         | 129        | 55.1 |
| 学历 | 本科       | 180        | 76.9 |
|      | 硕士       | 42         | 17.9 |
|      | 博士       | 12         | 5.2  |
| 年龄 | _M_ (_SD_) | 21.4 (2.3) | —    |

_注：N_ = 234。

### 场景二：报告变量描述与相关矩阵

放在 Results 节开头，**几乎所有社心论文都会有一张这种表**——把所有研究变量的均值、标准差、信度系数，以及它们两两之间的相关，合并到一张表里。这张表通常叫 Table 1，在三线表的对角线放 Cronbach's α，让读者一眼能判断你的测量是否可靠。

**正文段落模板**：

> 各研究变量的均值、标准差及相关系数见表 1。结果显示，自尊与幸福感呈显著正相关（_r_ = .51, _p_ < .001），与焦虑呈显著负相关（_r_ = –.42, _p_ < .001）。所有量表的内部一致性信度（Cronbach's α）均在 .79 以上，表明测量具有良好的可靠性。

**变量描述与相关矩阵表模板**：

| 变量      | _M_  | _SD_ | 偏度  | 峰度  | 1          | 2          | 3     |
| --------- | ---- | ---- | ----- | ----- | ---------- | ---------- | ----- |
| 1. 自尊   | 3.45 | 0.78 | –0.21 | –0.14 | (.85)      |            |       |
| 2. 焦虑   | 2.10 | 0.92 | 0.45  | 0.12  | –.42\*\*\* | (.79)      |       |
| 3. 幸福感 | 4.12 | 0.65 | –0.32 | 0.05  | .51\*\*\*  | –.35\*\*\* | (.81) |

_注：N_ = 234。对角线括号内为 Cronbach's α。\* _p_ < .05，\*\* _p_ < .01，\*\*\* _p_ < .001。

::: warning 几个细节坑

- 相关系数小数点前的 0 **要省略**（写 `.51` 不写 `0.51`），这是 APA 7 的硬规定。
- 均值和标准差不省略前导 0（写 `0.78` 不写 `.78`）。
- 显著性星号一般两两相关全做双侧检验。
- 偏度和峰度**不是必报**——但报上去能让读者判断你后续用参数检验是否合理，是个加分项。
  :::

## 描述性统计的常用方法

按"问什么问题用什么指标"来组织。

### 集中趋势：数据的"中心"在哪

| 指标              | 公式                                      | 适用变量       | 何时优先用                                 |
| ----------------- | ----------------------------------------- | -------------- | ------------------------------------------ |
| **均值** Mean     | $\bar{X} = \frac{1}{n}\sum_{i=1}^{n} X_i$ | 定距、定比     | 数据近似正态、无极端值                     |
| **中位数** Median | 排序后第 50% 分位                         | 定序及以上     | 偏态分布、有极端值（如收入、反应时）       |
| **众数** Mode     | 出现次数最多的值                          | 任意，定类必用 | 描述类别变量（最常见的群体、最热门的选项） |

::: tip 经验法则
反应时（RT）、收入、社交关系数等右偏数据，**用中位数而不是均值**；李克特量表（5 点、7 点）的合成分通常近似正态，用均值；性别、品牌偏好等类别变量只能用众数。
:::

### 离散程度：数据散得多开

最常用的两个：**方差**（variance）和**标准差**（SD）。

$$
s^2 = \frac{1}{n-1}\sum_{i=1}^{n}(X_i - \bar{X})^2, \qquad s = \sqrt{s^2}
$$

注意分母是 $n-1$（贝塞尔修正，针对样本估计总体方差），不是 $n$。SPSS、R、Python 默认都是 $n-1$。

其他指标：

- **范围**（range）：$\max - \min$。最简单，但对异常值极敏感。
- **四分位距**（IQR）：$Q_3 - Q_1$。中间 50% 数据的跨度，箱线图盒子的高度，**抗异常值**。
- **变异系数**（CV）：$\text{CV} = s / \bar{X}$。无量纲，可跨变量比较离散程度（比如比较"工资"和"工龄"哪个更分散）。

### 分布形态：偏度与峰度

- **偏度**（skewness）刻画对称性。正态分布偏度为 0；> 0 表示**右偏**（长尾在右，如反应时、收入）；< 0 表示**左偏**（长尾在左，如考试得分接近天花板）。
- **峰度**（kurtosis）刻画尾部厚度。心理学软件多数报**超额峰度**（excess kurtosis），正态分布为 0；> 0 表示尖峰厚尾；< 0 表示平峰。

::: tip 小提醒
做参数检验前检查偏度和峰度：

- $|\text{偏度}| < 2$ 且 $|\text{峰度}| < 7$：可视为近似正态，适用参数检验。
- 超出范围：考虑变换（log、平方根）、稳健估计、或非参数方法。

不要光看 Shapiro-Wilk 的 _p_ 值——样本量大时它会"过度敏感"，几乎一定显著。
:::

### 频次与比例

针对类别变量。

- **频次**（frequency）：每一类多少人。
- **百分比**（percentage / valid percent）：valid percent 排除了缺失值，是论文里通常报告的那个。
- **列联表**（cross-tabulation）：两个类别变量交叉。例如 性别 × 是否参加干预 → 4 个格子，配合卡方检验使用。

## 软件实现

下面以 `df` 为已读入的数据框（被试 × 变量）演示。SPSS 给出菜单路径与等价语法两种。

### SPSS

#### 1. 连续变量的均值、SD、偏度、峰度

**菜单**：Analyze → Descriptive Statistics → Descriptives → 选入变量 → Options 勾选 Mean / Std. Deviation / Skewness / Kurtosis。

**语法**：

```bash
DESCRIPTIVES VARIABLES=self_esteem anxiety wellbeing
  /STATISTICS=MEAN STDDEV MIN MAX SKEWNESS KURTOSIS.
```

#### 2. 类别变量频次

**菜单**：Analyze → Descriptive Statistics → Frequencies → 选入变量。

**语法**：

```bash
FREQUENCIES VARIABLES=gender education
  /ORDER=ANALYSIS.
```

#### 3. 分组描述（按性别看自尊均值）

**菜单**：Analyze → Compare Means → Means。

**语法**：

```bash
MEANS TABLES=self_esteem BY gender
  /CELLS=MEAN COUNT STDDEV.
```

#### 4. 探索性分析（含箱线图、Q-Q 图、Shapiro-Wilk）

**菜单**：Analyze → Descriptive Statistics → Explore → 选 Plots → 勾 Histogram、Normality plots with tests。

**语法**：

```bash
EXAMINE VARIABLES=self_esteem BY gender
  /PLOT BOXPLOT HISTOGRAM NPPLOT
  /STATISTICS DESCRIPTIVES
  /MISSING LISTWISE.
```

#### 5. 相关矩阵

```bash
CORRELATIONS
  /VARIABLES=self_esteem anxiety wellbeing
  /PRINT=TWOTAIL NOSIG
  /MISSING=PAIRWISE.
```

::: details 一键搞定 Table 1 的小技巧
SPSS 自带的 `CORRELATIONS` 输出不带均值和 SD。可以分两次跑（一次 DESCRIPTIVES、一次 CORRELATIONS），再手动拼到一张表里；或者直接用 R 包 `apaTables::apa.cor.table()` / Python 的 `pingouin.rcorr()` 一键生成可粘贴的格式。
:::

### Python

主要用 `pandas` + `scipy.stats`，可视化用 `seaborn`。

#### 1. 一行总览

::: code-group

```python [pandas]
import pandas as pd
df = pd.read_csv("data.csv")

# 连续变量总览：count / mean / std / min / Q1 / median / Q3 / max
df.describe()

# 类别变量总览
df.describe(include="object")

# 全部变量
df.describe(include="all")
```

```python [pingouin]
# pingouin 的描述统计更心理学友好，自带置信区间
import pingouin as pg
pg.normality(df[["self_esteem", "anxiety", "wellbeing"]])
```

:::

#### 2. 单个指标

```python
df["self_esteem"].mean()
df["self_esteem"].median()
df["self_esteem"].mode()           # 众数（可能多个）
df["self_esteem"].std()            # ddof=1，与 SPSS 一致
df["self_esteem"].var()
df["self_esteem"].quantile([0.25, 0.5, 0.75])
df["self_esteem"].skew()           # 偏度
df["self_esteem"].kurt()           # 超额峰度（excess kurtosis）
```

#### 3. 类别变量频次

```python
df["gender"].value_counts()                         # 频次
df["gender"].value_counts(normalize=True) * 100     # 百分比

# 列联表
pd.crosstab(df["gender"], df["condition"])
pd.crosstab(df["gender"], df["condition"], normalize="index")  # 行百分比
```

#### 4. 分组描述

```python
df.groupby("gender")["self_esteem"].agg(["count", "mean", "std", "min", "max"])

# 多变量同时分组
df.groupby("gender")[["self_esteem", "anxiety", "wellbeing"]].agg(["mean", "std"])
```

#### 5. 相关矩阵

```python
# pandas 默认 Pearson；可改 method="spearman" / "kendall"
df[["self_esteem", "anxiety", "wellbeing"]].corr().round(2)

# 带显著性的相关矩阵（推荐）
import pingouin as pg
pg.rcorr(df[["self_esteem", "anxiety", "wellbeing"]],
         method="pearson", upper="pval", decimals=2)
```

#### 6. 一键生成"准 Table 1"

```python
def table1(df, vars):
    """生成均值、SD、偏度、峰度的描述统计表。"""
    stats = df[vars].agg(["mean", "std", "skew", "kurt"]).T
    stats.columns = ["M", "SD", "Skewness", "Kurtosis"]
    return stats.round(2)

table1(df, ["self_esteem", "anxiety", "wellbeing"])
```

## 进阶要点

下面这几个点教科书里散落各处，但每个都直接关系到你能不能把数据"看明白"。

### 1. 异常值（outliers）：先看见，再决定怎么办

**怎么发现**：

- **箱线图**：超出 $Q_1 - 1.5 \times \text{IQR}$ 或 $Q_3 + 1.5 \times \text{IQR}$ 的点。最直观，不依赖正态假设。
- **Z 分数**：$|z| > 3.29$（相当于双侧 .001）通常视为异常。注意 z 分数本身基于均值和 SD，**容易被异常值"污染"**。
- **马氏距离**（Mahalanobis distance）：处理多变量异常值。SPSS 在 Regression → Save → Distances 里能输出。

**怎么处理**（按推荐程度）：

1. **检查录入错误**——身高 1880cm、年龄 105 岁这种，直接改或删。
2. **检查注意力检测题、答题速度**——答题时间过短（如 < 1 秒/题）或选了相反答案的"反向题陷阱"，剔除。
3. **保留并报告**——如果只是真实数据中的极端值，<span class="kw">先做敏感性分析（含 vs 不含异常值），看结论是否稳健</span>，并在论文中报告。
4. **温莎化**（winsorization）——把超过 5%（或 1%）分位的值替换为该分位值。
5. **变换**——log、平方根，常用于反应时和收入。

::: danger 不要做的事

- 不要光因为某个值"看着远"就删，要给出**事先设定**的剔除标准（最好预注册），否则就是 _p_-hacking。
- 不要删除数据后却不报告，违反 APA 透明性原则。
  :::

### 2. 缺失数据（missing data）

至少回答三个问题：

- **缺多少**：每个变量的缺失率。> 5% 就要慎重；> 20% 通常需要专门方法处理。
- **缺得有规律吗**：MCAR（完全随机缺失）/ MAR（随机缺失）/ MNAR（非随机缺失）。Little's MCAR test 可粗略检验。
- **怎么办**：
  - Listwise deletion（默认行为）：损失样本量，要求 MCAR。
  - 均值/中位数填补：**不推荐**，会低估方差。
  - 多重插补（multiple imputation, MI）：金标准之一。R 用 `mice`，Python 用 `sklearn.impute.IterativeImputer`，SPSS 在 Analyze → Multiple Imputation。
  - FIML（在 SEM 里直接用全信息极大似然）：无需先填补，AMOS / lavaan / Mplus 都支持。

### 3. 正态性评估：不要只看 Shapiro-Wilk

**视觉为主，统计检验为辅**：

- 直方图 + 拟合正态曲线
- Q-Q 图（quantile-quantile plot）：点接近对角线即近似正态
- 偏度、峰度数值（见上文经验法则）
- Shapiro-Wilk（小样本 _n_ < 50 较合适）、Kolmogorov-Smirnov（大样本不推荐，过度敏感）

::: tip 实操建议
_N_ > 200 时几乎所有数据都会被 Shapiro-Wilk 判为"显著偏离正态"。这时候<span class="kw">看偏度峰度比看 _p_ 值更靠谱</span>，加上 _t_ 检验、ANOVA、回归对中等程度的非正态本身就比较稳健。
:::

### 4. 分组描述与可视化：描述性统计的可视化形式

描述性统计**不只是数字，还包括图**。论文 Results 节里的"图 1"很多时候就是描述性统计的可视化版本。

按变量类型对应的常用图：

| 数据形式           | 图类型                   | 工具                             |
| ------------------ | ------------------------ | -------------------------------- |
| 单连续变量分布     | 直方图、密度图           | `sns.histplot` / `sns.kdeplot`   |
| 单连续变量按组比较 | 箱线图、小提琴图、雨云图 | `sns.boxplot` / `sns.violinplot` |
| 两连续变量关系     | 散点图（带回归线）       | `sns.regplot`                    |
| 多连续变量两两关系 | 散点矩阵 / 相关热图      | `sns.pairplot` / `sns.heatmap`   |
| 类别 × 类别        | 堆叠条形图、马赛克图     | `sns.countplot`                  |

详细的作图原则与代码见 [4 · 科研作图](/4-visualization/)。

### 5. APA 7 报告规范速查

::: info 几条最常踩雷的格式

- 统计符号斜体：_M_、_SD_、_N_、_n_、_r_、_p_、_t_、_F_。
- _p_ 值：精确到小数点后 2–3 位（_p_ = .03，_p_ = .002），**< .001 才写 _p_ < .001**，不写 _p_ = .000。
- 相关系数和 _p_ 值省略前导 0：`r = .42`，`p = .03`。
- 均值、标准差、未标准化系数保留 2 位小数；测量量表的单条目分可保留 2 位。
- 自由度写在统计量后括号内：_t_(232) = 2.41。
- 区分"达到显著"和"接近显著"——APA 7 不再鼓励用 "marginally significant" 这种说法。
  :::

### 6. 信度（reliability）：放在描述统计还是单独一节

严格说，Cronbach's α、McDonald's ω 是测量的属性，不是数据的属性，但论文里习惯把它们和描述性统计**一起报**——通常放进相关矩阵的对角线上。

最低限度报告：每个多条目量表的 α 值。α ≥ .70 通常视为可接受，> .80 良好，> .90 优秀（但 α 过高也可能意味着条目冗余）。这个话题完整展开会牵扯到测量学，本节不深入；先记住"对角线放 α"这个惯例就够了。

## 资源与工具

<ResourceGrid :min="220">
  <ResourceCard
    name="jamovi"
    desc="开源 SPSS 替代品 · 描述统计一键导出 APA 表"
    href="https://www.jamovi.org/"
    icon="📊"
  />
  <ResourceCard
    name="JASP"
    desc="开源贝叶斯+频率派 · 表格直接 APA 格式"
    href="https://jasp-stats.org/"
    icon="🧮"
  />
  <ResourceCard
    name="pingouin (Python)"
    desc="心理学友好的统计包 · 描述/相关/正态性"
    href="https://pingouin-stats.org/"
    icon="🐧"
  />
  <ResourceCard
    name="apaTables (R)"
    desc="一键生成 APA 格式的描述+相关矩阵表"
    href="https://cran.r-project.org/package=apaTables"
    icon="📑"
  />
  <ResourceCard
    name="APA Style 7th"
    desc="官方统计与数字格式指南"
    href="https://apastyle.apa.org/style-grammar-guidelines/tables-figures"
    icon="📖"
  />
</ResourceGrid>

## 延伸阅读

- 甘怡群等. (2017). _心理与行为科学统计（第二版）_. 北京大学出版社. ——本系列推荐教材，第 2–3 章覆盖本节内容。
- Kline, R. B. (2016). _Principles and practice of structural equation modeling_ (4th ed.). Guilford Press. ——书中关于偏度峰度阈值（|skew| < 2, |kurt| < 7）的经验法则被广泛引用。
- Tabachnick, B. G., & Fidell, L. S. (2019). _Using multivariate statistics_ (7th ed.). Pearson. ——异常值检测与多变量假设检查的标准参考。
- Schafer, J. L., & Graham, J. W. (2002). Missing data: Our view of the state of the art. _Psychological Methods, 7_(2), 147–177. ——缺失数据处理的经典综述。
- APA. (2020). _Publication manual of the American Psychological Association_ (7th ed.). ——表格、统计符号、数字格式的官方规定。
