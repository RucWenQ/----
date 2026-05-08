---
title: 3.4.0 相关分析
description: Pearson、Spearman、Kendall、点二列、偏相关的原理与适用场景，含 SPSS / Python 实现及 Anscombe 警示
---

# 3.4.0 相关分析

::: tip 本节目标

读完本节后你能：

- 用一句话说清 Pearson *r* 在算什么——它的"协方差"血统从哪来。
- 区分 **Pearson、Spearman、Kendall、点二列、偏相关** 五种相关系数，并知道你的数据该用哪个。
- 在 SPSS 和 Python 中做出一张含显著性的相关矩阵，并写成 APA 三线表。
- 看懂 Anscombe 四重奏的警告：**相同的 *r* 可能来自完全不同的数据**——所以画图永远先于报告 *r*。
- 避开"相关 ≠ 因果"和"截断范围"两个最常见的误用。

:::

<OutlineCard title="本节路线图">

- 相关分析在做什么
- Pearson r 的公式与直觉
- 相关系数的家族：选哪一种？
- 用之前要满足什么条件
- 一个完整例子
- Anscombe 警示：r 是不够的
- 偏相关：多元回归的预演
- 相关 ≠ 因果（5 种典型错觉）
- SPSS / Python 实现
- 怎么把相关矩阵写进论文
- 常见误用与替代方案

</OutlineCard>

## 一、相关分析在做什么

相关分析回答**两个连续变量是否一起变化、变化方向如何、关联有多强**——三件事用一个数 *r* 全打包。

- *r* 的取值范围：**-1 到 +1**
- *r* > 0：正相关（一个高，另一个也倾向高）
- *r* < 0：负相关（一个高，另一个倾向低）
- *r* = 0：**线性**无关（**不等于**独立！见 Anscombe 一节）
- |*r*| 接近 1：关联非常强；|*r*| 接近 0：关联很弱

::: tip 跟差异分析的关系
回顾本章总览的核心论点：相关 ≈ 一元回归（[3.4 总览](./regression)）。Pearson *r* 等价于一元回归的标准化系数 β，*r²* 等价于回归的 *R²*。所以学相关其实就是**用最简单的语言学回归的内核**。
:::

## 二、Pearson r 的公式与直觉

### 1. 公式

$$
r = \frac{\sum_{i=1}^{n} (X_i - \bar{X})(Y_i - \bar{Y})}{\sqrt{\sum (X_i - \bar{X})^2 \sum (Y_i - \bar{Y})^2}}
$$

或者用更简洁的写法（协方差 / 标准差乘积）：

$$
r = \frac{\text{Cov}(X, Y)}{SD_X \cdot SD_Y}
$$

### 2. 直觉版：r 在算什么

把这个公式拆成三步看：

**第一步：每个被试的"双重偏离"**

对每个数据点，看它在 *X* 上偏离 *X* 均值多少、在 *Y* 上偏离 *Y* 均值多少，然后**把两个偏离相乘**：

- 如果一个被试 *X* 偏高、*Y* 也偏高 → 两个正数相乘 = **正贡献**
- 如果一个被试 *X* 偏低、*Y* 也偏低 → 两个负数相乘 = **正贡献**
- 如果一个 *X* 偏高、*Y* 偏低（或反过来）→ 一正一负相乘 = **负贡献**

**第二步：把所有人的"双重偏离"加起来**

得到的就是分子。它叫"乘积和"（sum of cross-products），是协方差的核心。

**第三步：除以"两个变量各自波动的乘积"**

分子有个量纲问题（如果 *X* 是身高厘米、*Y* 是体重公斤，分子的单位是 kg·cm）。除以两个 SD 的乘积让 *r* **无量纲**，并被压在 -1 到 +1 之间。

::: tip 一个生活化的类比
两个朋友的心情。如果他俩 *总是一起开心、一起郁闷*，他们的心情正相关；如果一个开心时另一个总在郁闷，负相关；如果一人的心情完全不由另一人决定，*r* 接近 0。
*r* 衡量的就是这种"步调一致"的程度。
:::

### 3. r 的平方：解释变异的比例

$r^2$ 称为**决定系数**（coefficient of determination），表示 *Y* 的总变异中能被 *X* "解释"的比例。

例：*r* = 0.50 时 *r²* = 0.25 → *X* 能解释 *Y* 的 25% 变异。
例：*r* = 0.30 时 *r²* = 0.09 → *X* 能解释 *Y* 的 9% 变异。

<span class="kw">这是为什么 *r* = 0.30 听起来不小，但其实只解释了 9% 的变异——直接看 *r* 容易高估关系的"实际重要性"</span>。报告时 *r* 和 *r²* 一起给比较稳妥。

### 4. Cohen 的解读标尺（仅供参考）

| 量级 | |*r*| | *r²* | 含义 |
| --- | --- | --- | --- | --- |
| 小 | .10 | .01 | 1% 变异 |
| 中 | .30 | .09 | 9% 变异 |
| 大 | .50 | .25 | 25% 变异 |

::: warning 别死套标尺
Cohen 的标尺是 1988 年基于行为科学普遍水平制定的。**社心方向的元分析显示**，跨研究的真实效应均值约为 *r* = .20-.25——所以 *r* > .50 在社心方向已经是**很大**的效应。看到论文报 *r* > .80 时建议先怀疑是不是有共同方法偏差或测量重叠问题。
:::

## 三、相关系数的家族：选哪一种？

教材里有十几种相关系数，但社心方向常用的就五种。

| 系数 | 适用情形 | 选它的理由 |
| --- | --- | --- |
| **Pearson *r*** | 两个**连续**变量，**线性**关系 | 默认；统计功效最高 |
| **Spearman ρ**（rho） | **定序**变量；或非线性单调关系；或有异常值 | 用秩次代替原值，不受异常值影响 |
| **Kendall τ**（tau） | 同 Spearman；样本极小（n < 20） | 比 Spearman 更稳健，但功效略低 |
| **点二列相关**（point-biserial *r*）| 一个二分类 + 一个连续 | 与 t 检验**等价**——其实是同一件事的不同视角 |
| **Phi 系数 φ** | 两个二分类 | 与 2×2 卡方**等价**（[3.3](./chi-square) 已讲） |

::: tip 实操建议
- **默认用 Pearson**——除非你有具体理由换。
- **看到反应时、收入这种右偏数据 → Spearman**——它对极端值不敏感。
- **量表数据（多条目李克特合成分）→ Pearson 通常没问题**——合成分近似定距。
- **单条目李克特项做相关 → Spearman 更稳妥**。
- **遇到二分类 → 直接编码 0/1 跑 Pearson**——结果就是点二列相关，和 t 检验等价。
:::

## 四、用之前要满足什么条件

### Pearson r 的核心假设

1. **观测独立**——同一个人不能在数据集里出现多次。同班同学这种数据建议先看 [3.6](./mixed-effects)。
2. **线性关系**——Pearson *r* 只检测**直线**关系。U 型、S 型、阈值型关系它会漏掉（见下一节 Anscombe 警示）。
3. **两个变量近似双变量正态**——大样本下不太致命，小样本（n < 30）需要正态性。
4. **没有严重异常值**——Pearson *r* 对异常值极其敏感，一两个极端点就能把 *r* 从 .60 拉到 .20。

### Spearman / Kendall 的优势

- 只要求**单调关系**（一直增或一直减），不要求线性。
- 用秩次代替原值——异常值的影响大幅减弱。
- 对正态性几乎没要求。

::: warning 三件事，做相关之前一定要做
1. **画散点图**——看关系是不是线性、有没有异常值、有没有亚组结构。
2. **看每个变量的描述统计**——是否被截断（floor/ceiling）。
3. **n 是否够**——Cohen 的功效分析建议：检测 *r* = .30 在 .80 功效下，需要 n ≈ 84。

不画散点图就报告 *r* 是这一节最严重的方法论错误。
:::

## 五、一个完整例子

### 1. 研究背景

一个常被检验的关联：**自尊（self-esteem）与生活满意度（life satisfaction）**。文献中典型元分析结果显示 *r* ≈ .47（Diener et al., 1995）。

### 2. 假设虚拟数据

*N* = 200 大学生：

- 自尊（Rosenberg 量表 10 题均分，1-5）：*M* = 3.45, *SD* = 0.78
- 生活满意度（SWLS 5 题均分，1-7）：*M* = 4.50, *SD* = 1.20

### 3. 跑 Pearson 相关

得到：

> *r*(198) = .51, 95% CI [.40, .60], *p* < .001, *r²* = .26

解读：

- *r* = .51 是**中到大**的正相关。
- *r²* = .26 → 自尊**解释了**生活满意度 26% 的变异。
- 95% CI 不过 0 → 在 .05 水平显著。
- *p* < .001 → 这种 |*r*| ≥ .51 的结果在零相关下出现概率 < 0.1%。

### 4. 报告这个相关之前要做什么

第一件事——**画散点图**。在画图之前不要写报告。

下一节解释为什么。

## 六、Anscombe 警示：r 是不够的

1973 年 Frank Anscombe 构造了 4 组数据，**每组的均值、SD、相关系数 *r* 都几乎完全相同**（*r* ≈ .82）：

```
数据集 1：清晰的线性关系（r 是诚实的描述）
数据集 2：完美的二次曲线（r 漏掉了非线性）
数据集 3：一条直线 + 一个极端异常值（r 被异常值拉高）
数据集 4：所有 X 几乎都相同 + 一个极端点（r 完全是异常点造成的）
```

**这四组数据如果只看 *r* 是看不出区别的——但散点图一眼就能看出它们是完全不同的故事。**

::: danger 唯一的实操结论
做相关分析的第一件事**永远是画散点图**。这点没有商量余地。
- *r* 高 + 散点图不像直线 → 关系是非线性的，*r* 是误导。
- *r* 中等 + 散点图分成两团 → 实际上是亚组效应，应该分组分析或加协变量。
- *r* 低 + 散点图明显有曲线 → 关系存在，但不是线性。
- *r* 高 + 一个极端点 → *r* 由这一个点驱动，去掉它后 *r* 可能 ≈ 0。

<span class="kw">永远不要在没看过散点图的情况下报告相关系数</span>。
:::

类似的"看图先于看数"的工具：**Datasaurus dozen**（Matejka & Fitzmaurice, 2017）扩展了 Anscombe 的思路，构造了 13 组数据，描述统计完全相同，但散点图从恐龙到星型千差万别。

## 七、偏相关：多元回归的预演

**偏相关**（partial correlation）回答的问题：在**控制掉**第三变量 *Z* 的影响后，*X* 和 *Y* 之间还有没有相关？

公式：

$$
r_{XY \cdot Z} = \frac{r_{XY} - r_{XZ} \cdot r_{YZ}}{\sqrt{(1 - r_{XZ}^2)(1 - r_{YZ}^2)}}
$$

### 一个例子

冰激凌销量与溺水事件的相关 *r* = .80。但加入"气温" *Z* 后做偏相关：

$$
r_{\text{冰激凌, 溺水} \cdot \text{气温}} \approx 0
$$

气温**是共同原因**——它同时驱动了冰激凌销量和溺水率。控制气温后，两者没有直接关系。

::: tip 偏相关本质上是一元回归 + 多元回归
偏相关 *r*<sub>XY·Z</sub> 数学上等价于："把 *X* 和 *Y* 都对 *Z* 做回归取残差，然后算两份残差的 Pearson 相关。"

也就是说——<span class="kw">偏相关就是"把 Z 这部分的方差从 X 和 Y 里都剥掉"，然后看剩下的部分还相不相关</span>。这正是多元回归"控制其他变量"的几何含义。学到 [3.4.2 多元回归](./multiple-regression) 时这个直觉会派上大用场。
:::

### 还有一种"半偏相关"

**Semi-partial correlation**（也叫 part correlation）：只把 *Z* 从 *X* 中剔除，不剔除 *Y*。它在多元回归里对应"该 IV 单独贡献的 *R²* 增量"。多元回归章节会展开。

## 八、相关 ≠ 因果：5 种典型错觉

这是科普书写烂了的话题，但在心理学论文中**犯错的人仍然很多**。值得专门列一节。

::: danger 5 种把相关误读成因果的常见错误

1. **方向反了**：相关本身没有方向。"自尊与幸福感正相关"既可能是"自尊 → 幸福"，也可能是"幸福 → 自尊"。横断研究无法分辨。

2. **共同原因（confounding）**：*X* 和 *Y* 都被第三变量驱动。冰激凌-溺水的故事就是这种。

3. **选择偏差（selection bias）**：你的样本不是从总体随机抽的。"上大学 vs 不上大学"对收入的相关，混杂了"能上大学的家庭本来就有钱"。

4. **逆向因果（reverse causation）**：实际是 *Y* 影响 *X*。"压力与免疫力负相关"——可能是免疫差导致的躯体不适让人感觉压力大。

5. **巧合或多重比较**：随机相关，特别是高维数据中。Tyler Vigen 的网站（spurious correlations）收集了大量虚假高相关：尼古拉斯·凯奇电影数与游泳池溺亡数 *r* = .67。

横断研究里报告 *r* 时，<span class="kw">永远要在论文 Discussion 里讨论上述至少 1-2 种替代解释</span>。
:::

## 九、SPSS 实现

### 1. 单组相关

**菜单**：`Analyze → Correlate → Bivariate`

把要相关的变量都拖入 Variables；勾选 Pearson；勾 Two-tailed；勾 Flag significant correlations。

**语法**：

```spss
CORRELATIONS
  /VARIABLES=self_esteem life_satisfaction stress
  /PRINT=TWOTAIL NOSIG FULL
  /MISSING=PAIRWISE.
```

`/MISSING=PAIRWISE` 让每对变量用各自的可用配对——比 `LISTWISE`（全部齐全才算）更不浪费数据。但代价是不同相关基于不同 *N*。

### 2. Spearman / Kendall

```spss
NONPAR CORR
  /VARIABLES=education income
  /PRINT=SPEARMAN TWOTAIL NOSIG.
```

Kendall 把 `SPEARMAN` 改成 `KENDALL`。

### 3. 偏相关

**菜单**：`Analyze → Correlate → Partial`

把要分析的两个变量放 Variables，控制变量放 Controlling for。

```spss
PARTIAL CORR
  /VARIABLES=ice_cream drowning BY temperature
  /SIGNIFICANCE=TWOTAIL.
```

### 4. 一键导出 APA 格式相关矩阵

SPSS 原生输出不是 APA 格式。两个解决方案：

- 把输出复制到 Excel 手动整理（社心方向 90% 的人这么做）
- 用 Python `pingouin.rcorr()` 或 R `apaTables::apa.cor.table()` 替代

## 十、Python 实现

### 1. 单组 Pearson 相关

::: code-group

```python [scipy（基础）]
from scipy import stats

r, p = stats.pearsonr(df['self_esteem'], df['life_satisfaction'])
print(f"r = {r:.3f}, p = {p:.4f}")

# 注意：scipy 不直接给 95% CI
```

```python [pandas（多变量矩阵）]
df[['self_esteem', 'life_satisfaction', 'stress']].corr()
# 默认 Pearson；可改 method='spearman' / 'kendall'
```

```python [pingouin（推荐，APA 友好）]
import pingouin as pg

# 单对相关，含 CI、BF
pg.corr(df['self_esteem'], df['life_satisfaction'])
# 输出含 r, CI95%, p-val, BF10, power

# 多变量带显著性标的相关矩阵
pg.rcorr(df[['self_esteem', 'life_satisfaction', 'stress']],
         method='pearson', upper='pval', decimals=2)
```

:::

### 2. Spearman / Kendall

```python
from scipy import stats
rho, p = stats.spearmanr(df['edu'], df['income'])
tau, p = stats.kendalltau(df['edu'], df['income'])

# 或 pingouin 一行
pg.corr(df['edu'], df['income'], method='spearman')
```

### 3. 偏相关

```python
import pingouin as pg

# 控制气温后的偏相关
pg.partial_corr(data=df, x='ice_cream', y='drowning',
                covar='temperature', method='pearson')
```

### 4. 散点图（必须先画）

```python
import seaborn as sns
import matplotlib.pyplot as plt

# 单对
sns.regplot(data=df, x='self_esteem', y='life_satisfaction',
            scatter_kws={'alpha': 0.5})

# 多变量配对图（含分布）
sns.pairplot(df[['self_esteem', 'life_satisfaction', 'stress']],
             diag_kind='kde')

# 相关矩阵热图
import numpy as np
corr_matrix = df.corr()
sns.heatmap(corr_matrix, annot=True, cmap='RdBu_r',
            vmin=-1, vmax=1, center=0)
```

::: tip seaborn 的 regplot
`sns.regplot` 自带回归线和置信区域阴影，是探索性分析时最快速的"看一眼"工具。如果想要分组的回归线，用 `sns.lmplot(..., hue='group')`。
:::

## 十一、APA 格式的相关矩阵表

### 论文标配的 Table 1

社心方向几乎所有论文的 Table 1 都长这个样子：

| 变量 | *M* | *SD* | 1 | 2 | 3 |
| --- | --- | --- | --- | --- | --- |
| 1. 自尊 | 3.45 | 0.78 | (.85) |  |  |
| 2. 生活满意度 | 4.50 | 1.20 | .51\*\*\* | (.83) |  |
| 3. 焦虑 | 2.10 | 0.92 | -.42\*\*\* | -.35\*\*\* | (.79) |

*注：N* = 200。对角线括号内为 Cronbach's α。\*\*\* *p* < .001。

### 写作要点

- *r* 省略前导 0：`.51`，不是 `0.51`。
- *M* 和 *SD* 不省略前导 0：`3.45`，不是 `.45`。
- 一般报双侧 *p* 值。
- 显著性用星号：\* *p* < .05，\*\* *p* < .01，\*\*\* *p* < .001。
- **对角线放 Cronbach's α**——这是社心方向的强惯例（[3.1 描述统计](./descriptive)有详述）。

### 论文段落模板

> 各研究变量的均值、标准差及相关系数见表 1。结果显示，自尊与生活满意度呈显著正相关，*r*(198) = .51, *p* < .001，与焦虑呈显著负相关，*r*(198) = -.42, *p* < .001。生活满意度与焦虑呈显著负相关，*r*(198) = -.35, *p* < .001。所有量表的内部一致性信度（Cronbach's α）均在 .79 以上。

## 十二、常见误用与替代方案

### 1. 七个最常见的坑

::: danger 这些错误每天在论文里发生
1. **不画散点图就报 *r***——Anscombe 警示。
2. **报相关却不报 *N***——*r* 的解读必须依赖样本量。
3. **混淆 *r* 与 *r²***——*r* = .30 听起来还行，但 *r²* = .09 才是真实的"解释比例"。
4. **截断范围**（restriction of range）：只在小范围 *X* 内取样会**压低** *r*。如只在重点大学测智商-成绩相关，*r* 会比从所有学校取样小很多。
5. **生态谬误**（ecological fallacy）：班级层面的相关 ≠ 个人层面的相关。
6. **多重比较不校正**：测了 20 个变量做相关矩阵，190 对里期望约 9.5 个 *p* < .05 是假阳性。要做 Bonferroni 或 FDR 校正。
7. **横断报相关 + 因果语言**：写"自尊**导致**幸福"——审稿人会立刻枪毙。
:::

### 2. 替代方案速查

| 你的情况 | 替代方案 |
| --- | --- |
| 关系明显非线性 | 多项式回归 / GAM / Spearman |
| 有异常值 | Spearman / 稳健相关（如 Winsorized） |
| 数据有亚组结构 | 分组求 *r* 或加交互项的回归 |
| 想"控制"第三变量 | 偏相关 / 多元回归 |
| 想检验中介 | PROCESS / SEM（[3.5](./mediation-moderation)） |
| 同一对人多次测量 | 混合模型 / 重复测量相关 |
| 时间序列数据 | 自相关函数 / cross-correlation |

## 资源与工具

<ResourceGrid :min="220">
  <ResourceCard
    name="pingouin"
    desc="Python · 一行做相关 + CI + BF + power"
    href="https://pingouin-stats.org/build/html/generated/pingouin.corr.html"
    icon="🐧"
  />
  <ResourceCard
    name="apaTables (R)"
    desc="一键生成 APA 格式相关矩阵 Word 表"
    href="https://cran.r-project.org/package=apaTables"
    icon="📑"
  />
  <ResourceCard
    name="Datasaurus Dozen"
    desc="Anscombe 的现代加强版 · 13 组等统计量但散点图迥异的数据"
    href="https://www.research.autodesk.com/publications/same-stats-different-graphs/"
    icon="🦖"
  />
  <ResourceCard
    name="Spurious Correlations"
    desc="Tyler Vigen 收集的虚假相关 · 警示用"
    href="https://tylervigen.com/spurious-correlations"
    icon="🎲"
  />
</ResourceGrid>

## 延伸阅读

- Anscombe, F. J. (1973). Graphs in statistical analysis. *The American Statistician, 27*(1), 17–21. ——Anscombe 四重奏的原文。
- Matejka, J., & Fitzmaurice, G. (2017). Same stats, different graphs: Generating datasets with varied appearance and identical statistics through simulated annealing. *Proceedings of the 2017 CHI Conference*. ——Datasaurus dozen 的原文。
- Schäfer, T., & Schwarz, M. A. (2019). The meaningfulness of effect sizes in psychological research. *Frontiers in Psychology, 10*, 813. ——心理学相关效应量真实分布的元分析。
- Goodwin, L. D., & Leech, N. L. (2006). Understanding correlation: Factors that affect the size of *r*. *Journal of Experimental Education, 74*(3), 251–266. ——讨论范围截断、异常值等如何影响 *r*。
