---
title: 3.3 卡方检验
description: 拟合优度、独立性、同质性三种卡方检验的原理与适用场景，SPSS / Python 实现，含 Fisher 精确、McNemar 等替代方案
---

# 3.3 卡方检验

::: tip 本节目标

读完本节后你能：

- 区分**拟合优度检验**、**独立性检验**、**同质性检验**这三种"卡方"，并知道你的数据该用哪个。
- 理解 χ² 公式在算什么——为什么是"(观察 - 期望)² / 期望"的累加。
- 在 SPSS 和 Python 中跑一个 2×2 或 r×c 列联表分析，并正确读出**效应量**（φ / Cramer's V）。
- 显著之后做**事后比较**，定位是哪几个格子在驱动整体差异。
- 知道什么时候应该改用 **Fisher 精确检验**或 **McNemar 检验**。

:::

<OutlineCard title="本节路线图">

- 卡方检验在做什么
- 三种卡方：场景对应表
- 核心原理：观察值 vs. 期望值
- 用之前要满足什么条件
- 独立性检验完整例子
- 拟合优度检验：另一种用法
- 效应量：φ 与 Cramer's V
- 事后比较：哪一格在驱动结果
- SPSS / Python 实现
- 替代方案与常见误用

</OutlineCard>

## 一、卡方检验在做什么

t 检验、ANOVA 处理的都是"分类 IV × 连续 DV"的情形。但社心方向也经常遇到**两个变量都是分类的**情形：

- 男生和女生**是否赞成**某项政策的比例是否不同？
- 三种说服方式下，被试**接受还是拒绝**建议的比例是否不同？
- 干预组和对照组中**戒烟成功**的人数比例是否不同？

这些问题问的是 **类别频次的分布**——卡方检验就是这一类问题的标配工具。它的核心思想很朴素：**比较"实际观察到的频次"和"零假设下应该出现的频次"，看两者差距能不能大到不像随机波动**。

::: tip 一句话定位
- t / ANOVA：连续变量的 **均值** 比较
- 卡方：分类变量的 **频次（比例）** 比较
:::

## 二、三种卡方：场景对应表

教材里通常讲三种卡方检验。它们的**计算公式完全一样**，但回答的问题不同：

| 名称 | 数据形态 | 回答的问题 | 例子 |
| --- | --- | --- | --- |
| **拟合优度检验**<br>(goodness of fit) | 一个分类变量 | 频次是否符合某个**理论比例**？ | 心理系男女比例是否真的 1:1？ |
| **独立性检验**<br>(test of independence) | 两个分类变量，**同一群人** | 这两个变量**是否相关**？ | 性别 × 是否赞成（同一批人都被问） |
| **同质性检验**<br>(test of homogeneity) | 两个分类变量，**多个独立群体** | 几个群体在某个变量上的**分布是否相同**？ | 三个城市的人在党派支持上比例是否相同？ |

::: tip 独立性 vs. 同质性
**这两个检验在公式和操作上完全等价**，区别仅在抽样方式和研究问题的措辞：

- **独立性**：你抽了一群人，同时测两个变量。问"这两个变量相关吗？"
- **同质性**：你从几个总体各抽一群人，测一个变量。问"几个总体的分布相同吗？"

SPSS 和 Python 都不会区分这两者——都是把数据做成列联表然后跑同一个公式。社心方向 90% 的应用场景实际上是独立性检验。
:::

## 三、核心原理：观察值 vs. 期望值

### 1. 公式与直觉

卡方统计量：

$$
\chi^2 = \sum \frac{(O - E)^2}{E}
$$

其中 $O$ 是**观察频次**（实际数到的人数），$E$ 是**期望频次**（如果零假设成立，应该出现的人数）。

直觉解读：

- 把**每个格子**的"实际值与期望值的偏差平方"按"期望值"加权，再加起来。
- 偏差越大、格子越多，χ² 越大。
- χ² 大 → 实际分布和零假设差距大 → 拒绝零假设。

### 2. 期望频次怎么算（独立性检验）

对一个 r × c 列联表里的某个格子（第 i 行第 j 列）：

$$
E_{ij} = \frac{\text{第 i 行总数} \times \text{第 j 列总数}}{\text{总样本量 } N}
$$

直觉：如果两个变量真的独立，行总数和列总数应该按**乘法概率**分配到每个格子。

### 3. 自由度

- **拟合优度**：$df = k - 1$（k 是类别数）
- **独立性 / 同质性**：$df = (r-1)(c-1)$

2×2 表的 df 是 1，3×3 表的 df 是 4，以此类推。

## 四、用之前要满足什么条件

### 1. 三个核心条件

1. **观测独立**——同一个人不能在表里被数两次。这条违反，整个分析作废。
2. **每个格子的期望频次足够大**——经典经验法则：所有 $E_{ij} \geq 5$。如果有格子 < 5，结果不可靠。
3. **频次数据，不是百分比**——卡方算的是计数，必须用原始频次而不是比例。

### 2. 期望频次太小怎么办？

不同情形对应不同方案：

| 情形 | 推荐做法 |
| --- | --- |
| **2×2 表**任一格期望频次 < 5 | 用 **Fisher 精确检验** |
| **r×c 表**少数格子 < 5（如 < 20% 的格子） | 仍可用卡方，但结果偏保守 |
| **r×c 表**大量格子 < 5 | 合并相近的类别（如把"非常不同意"和"不同意"合并） |
| **配对数据**（同一个人前后两次） | 用 **McNemar 检验**，不是普通卡方 |

::: warning Yates 连续性校正：用还是不用？
经典 SPSS 输出会给一个 **Yates' continuity correction**（仅 2×2 表）。它把 |O - E| 减去 0.5 再做检验，结果偏保守。

- 老一辈教材推荐 2×2 表 + 小样本时用 Yates 校正。
- 现代模拟研究表明：<span class="kw">Yates 校正过度保守，导致功效下降，且小样本时直接用 Fisher 精确检验更合适</span>。
- 当代推荐：**默认不用 Yates 校正**；样本小时用 Fisher 精确检验代替。
:::

## 五、独立性检验完整例子

### 1. 研究背景

经典社心研究：**旁观者效应**（Latané & Darley, 1968）。一个被试假装癫痫发作，记录在场被试是否前去帮助。研究操纵"在场旁观者数量"，看帮助率是否随旁观者数量增加而下降。

### 2. 假设虚拟数据（独立性检验）

| 旁观者人数 | 帮助 (n) | 未帮助 (n) | 行总数 |
| --- | --- | --- | --- |
| 1 人在场 | 27 | 5 | 32 |
| 2 人在场 | 18 | 14 | 32 |
| 5 人在场 | 10 | 22 | 32 |
| **列总数** | **55** | **41** | **N = 96** |

### 3. 计算期望频次

第 1 行第 1 列（"1 人在场" 且 "帮助"）的期望频次：

$$
E_{11} = \frac{32 \times 55}{96} = 18.33
$$

实际值是 27，比期望值高很多——预示一旁观者条件的帮助率明显高于平均。

完整期望频次表：

| 旁观者人数 | 帮助 (E) | 未帮助 (E) |
| --- | --- | --- |
| 1 人 | 18.33 | 13.67 |
| 2 人 | 18.33 | 13.67 |
| 5 人 | 18.33 | 13.67 |

### 4. 计算卡方值

$$
\chi^2 = \sum \frac{(O - E)^2}{E} = \frac{(27-18.33)^2}{18.33} + \frac{(5-13.67)^2}{13.67} + \dots
$$

逐项算下来：

$$
\chi^2 \approx 4.10 + 5.50 + 0.02 + 0.03 + 3.61 + 4.84 = 18.10
$$

$df = (3-1)(2-1) = 2$，查表 *p* < .001。结论：旁观者数量与帮助行为**显著相关**。

### 5. 解读方向

光看 χ² 显著只知道"两个变量相关"，**不知道**：

- 哪些格子贡献了最多的偏差？
- 关系的方向（旁观者多 → 帮助率低？）

回答这两个问题需要 **效应量** 和 **事后比较**。

## 六、拟合优度检验：另一种用法

拟合优度检验用一个变量验证它的频次是否符合理论比例。

### 例子

你测了 200 名心理系本科生，其中 130 名女生、70 名男生。问：心理系本科生的性别比例是否和全校师生 1:1 不同？

零假设 H0：男女比例 1:1，即每个类别期望 100 人。

$$
\chi^2 = \frac{(130-100)^2}{100} + \frac{(70-100)^2}{100} = 9 + 9 = 18
$$

$df = 2 - 1 = 1$，*p* < .001。性别比例显著偏离 1:1。

::: details 期望比例不一定是均匀的
拟合优度检验里"期望比例"由你的理论决定——可以是均匀分布（每类各 1/k），也可以是任意理论分布：

- 检验"骰子是否公平" → 每面期望 1/6
- 检验本科心理系性别比 → 假设理论比例是全校的 6:4
- 检验某反应分布是否服从某理论 → 期望比例由理论给出

所以同一组数据，不同的理论假设会给不同的期望和不同的 χ² 值。
:::

## 七、效应量：φ 与 Cramer's V

χ² 本身**不是效应量**——它会随样本量上升而变大。同样的关联强度，*N* = 100 时 χ² = 5，*N* = 1000 时可能 χ² = 50。所以必须报告**与样本量无关**的效应量。

### 1. 三个常用效应量

| 效应量 | 适用 | 公式 |
| --- | --- | --- |
| **φ (phi)** | 仅 2×2 表 | $\phi = \sqrt{\chi^2 / N}$ |
| **Cramer's V** | 任意 r×c 表 | $V = \sqrt{\chi^2 / (N \times \min(r-1, c-1))}$ |
| **Odds Ratio** | 仅 2×2 表 | $OR = (a \times d)/(b \times c)$ |

φ 和 Cramer's V 在 2×2 时数学上等价。

### 2. Cohen 解读标尺

| df = min(r-1, c-1) | 小 | 中 | 大 |
| --- | --- | --- | --- |
| 1（2×2 或 2×k） | .10 | .30 | .50 |
| 2 | .07 | .21 | .35 |
| 3 | .06 | .17 | .29 |

注意 **df 越大，同样的"小/中/大"对应的 V 值越小**——格子多了，"显著的关联"更难达到。

### 3. 旁观者例子的效应量

继续上面的旁观者数据：χ² = 18.10, *N* = 96, $\min(r-1, c-1) = 1$。

$$
V = \sqrt{18.10 / (96 \times 1)} = \sqrt{0.189} \approx 0.43
$$

这是一个**接近大效应**的关联。OR 不适用（不是 2×2）。

## 八、事后比较：哪一格在驱动结果

χ² 显著只告诉你"整张表里存在关联"。要定位**是哪几个格子**让 χ² 这么大，需要看**调整后标准化残差**（adjusted standardized residuals, ASR）：

$$
\text{ASR}_{ij} = \frac{O_{ij} - E_{ij}}{\sqrt{E_{ij}(1 - p_{i\cdot})(1 - p_{\cdot j})}}
$$

其中 $p_{i\cdot}$ 和 $p_{\cdot j}$ 是行和列的边际比例。

判断标准：

- **|ASR| > 1.96** → 该格子在 .05 水平显著偏离独立预期
- **|ASR| > 2.58** → .01 水平显著
- **正 ASR** → 实际比期望多
- **负 ASR** → 实际比期望少

### 旁观者例子的 ASR 表

| 旁观者人数 | 帮助 ASR | 未帮助 ASR |
| --- | --- | --- |
| 1 人 | **+2.86** | **−2.86** |
| 2 人 | −0.10 | +0.10 |
| 5 人 | **−2.76** | **+2.76** |

读数：

- "1 人在场"条件下"帮助"格子 ASR = +2.86，显著高于期望——独自一人时帮助率明显偏高。
- "5 人在场"条件下"帮助"格子 ASR = −2.76，显著低于期望——人多时帮助率明显偏低。
- "2 人在场"全部不显著，说明它和总平均水平差不多。

::: tip 多重比较的考虑
当表格里有很多格子时（比如 4×4），用 ASR 做事后比较等于做了 16 次检验，I 类错误会膨胀。可以用 Bonferroni 校正——把临界值从 ±1.96 改成对应 α/k 的 z 值（k 是格子数）。
:::

## 九、SPSS 实现

### 1. 独立性检验

**菜单**：`Analyze → Descriptive Statistics → Crosstabs`

把一个变量拖入 Row(s)，另一个拖入 Column(s)；点 **Statistics** 勾选 Chi-square 和 Phi/Cramer's V；点 **Cells** 勾选 Observed、Expected、**Adjusted standardized residuals**。

**语法**：

```spss
CROSSTABS
  /TABLES=bystander BY help
  /STATISTICS=CHISQ PHI
  /CELLS=COUNT EXPECTED ROW SRESID ASRESID
  /COUNT ROUND CELL.
```

`ASRESID` 就是事后比较用的调整标准化残差。

### 2. 拟合优度检验

**菜单**：`Analyze → Nonparametric Tests → Legacy Dialogs → Chi-square`

**语法**（验证性别比 1:1）：

```spss
NPAR TESTS
  /CHISQUARE=gender
  /EXPECTED=EQUAL
  /MISSING ANALYSIS.
```

非均匀理论比例：把 `/EXPECTED=EQUAL` 改成 `/EXPECTED=60 40`（按比例填入）。

### 3. Fisher 精确检验

2×2 表期望频次 < 5 时，SPSS 会**自动**在输出里给 Fisher's exact test 的结果——不用单独操作，直接看就行。更大表格用：

```spss
CROSSTABS
  /TABLES=var1 BY var2
  /STATISTICS=CHISQ
  /METHOD=EXACT.
```

注意 `EXACT` 计算量极大，r×c 表很大时可能跑不动。

## 十、Python 实现

### 1. 独立性检验

::: code-group

```python [scipy（基础）]
from scipy import stats
import numpy as np

# 列联表（旁观者 × 帮助）
table = np.array([
    [27, 5],   # 1 人在场
    [18, 14],  # 2 人在场
    [10, 22],  # 5 人在场
])

chi2, p, dof, expected = stats.chi2_contingency(table)
print(f"χ² = {chi2:.2f}, df = {dof}, p = {p:.4f}")
print("期望频次：")
print(expected)

# 注意：scipy 默认对 2×2 应用 Yates 校正
# 想关闭：correction=False
chi2, p, dof, expected = stats.chi2_contingency(table, correction=False)
```

```python [pingouin（推荐）]
import pingouin as pg
import pandas as pd

# 长格式数据
df = pd.read_csv("bystander.csv")

# 一行搞定，含效应量
expected, observed, stats_result = pg.chi2_independence(
    df, x='bystander', y='help'
)
print(stats_result)
# 输出含 χ², p, df, Cramer's V, power
```

```python [手动算 ASR 事后比较]
# scipy 不直接给 ASR，需要自己算
import numpy as np

def adjusted_standardized_residuals(observed):
    """计算调整标准化残差。"""
    n = observed.sum()
    row_totals = observed.sum(axis=1, keepdims=True)
    col_totals = observed.sum(axis=0, keepdims=True)
    expected = row_totals @ col_totals / n

    row_props = row_totals / n
    col_props = col_totals / n

    se = np.sqrt(expected * (1 - row_props) * (1 - col_props))
    return (observed - expected) / se

asr = adjusted_standardized_residuals(table)
print("调整标准化残差（|ASR| > 1.96 显著）：")
print(asr.round(2))
```

:::

### 2. 拟合优度检验

```python
from scipy import stats

# 观察频次：130 女、70 男；期望比例 1:1（即各 100）
observed = [130, 70]
expected = [100, 100]
chi2, p = stats.chisquare(observed, expected)
print(f"χ² = {chi2:.2f}, p = {p:.4f}")

# 期望比例不均匀（如理论比例 6:4）
expected = [120, 80]  # 200 × 0.6, 200 × 0.4
chi2, p = stats.chisquare(observed, expected)
```

### 3. Fisher 精确检验（仅 2×2）

```python
from scipy import stats

# 2×2 表
table = np.array([[8, 2], [1, 5]])
odds_ratio, p = stats.fisher_exact(table, alternative='two-sided')
print(f"OR = {odds_ratio:.2f}, p = {p:.4f}")
```

### 4. McNemar 检验（配对数据）

```python
from statsmodels.stats.contingency_tables import mcnemar

# 同一批人前后两次的 yes/no
# 行 = 前测，列 = 后测
table = np.array([[40, 12], [3, 25]])  # 12 个人前测yes后测no, 3个反过来
result = mcnemar(table, exact=True)
print(f"χ² = {result.statistic:.2f}, p = {result.pvalue:.4f}")
```

## 十一、APA 报告模板

### 独立性检验 + 事后比较

> 卡方检验显示，旁观者数量与帮助行为存在显著关联，χ²(2, *N* = 96) = 18.10, *p* < .001, Cramer's *V* = .43。调整标准化残差表明，独自一人在场时被试帮助的比例显著高于期望（27 人帮助 vs. 期望 18.33；ASR = +2.86），而五人在场时帮助比例显著低于期望（10 人帮助 vs. 期望 18.33；ASR = −2.76）；两人在场条件下帮助比例与期望无显著差异。这一模式与旁观者效应理论一致。

### 拟合优度检验

> 拟合优度检验显示，本系本科生的性别分布显著偏离 1:1 预期，χ²(1, *N* = 200) = 18.00, *p* < .001。具体而言，女生（130 人，65%）显著多于男生（70 人，35%）。

### 写作禁忌

::: danger 这些写法会被审稿人指出来
- 写 *p* = .000 → 改成 *p* < .001
- 不报效应量 → 必须报 φ 或 Cramer's V
- 不报样本量 → χ² 写作需注明 *N*：χ²(df, *N* = ...)
- 用百分比作为输入 → 必须用频次
- "旁观者越多帮助率越低"——光卡方说不出方向，要靠 ASR 或单独的趋势检验
:::

## 十二、替代方案与常见误用

### 1. 替代方案速查

| 你的情况 | 替代方案 |
| --- | --- |
| 2×2 表 + 期望频次 < 5 | **Fisher 精确检验** |
| 配对数据（同一人前后两次） | **McNemar 检验** |
| 配对数据 + 多于 2 个条件 | **Cochran's Q** |
| 有序分类变量（如李克特） | **Mantel-Haenszel 趋势检验** |
| 有连续协变量需控制 | **Logistic 回归** |
| 有控制层（如分性别看条件 × 反应） | **分层卡方 / Mantel-Haenszel** |
| 多重比较时 | **Bonferroni 校正后 ASR** |

### 2. 常见误用清单

::: danger 五个最高频的坑
1. **拿百分比当输入**——卡方算的是**频次**，输入百分比会得到错误的 χ² 和 p 值。
2. **同一个人在表里被数多次**——独立性假设直接破坏。
3. **把有序变量当无序处理**——5 点李克特做卡方会丢掉"顺序"信息，应该用趋势检验或 Mann-Whitney。
4. **不报效应量**——χ² 大可以是因为关联强、也可以是因为 N 大。Cramer's V 才说效应。
5. **小样本还坚持卡方**——2×2 表期望频次 < 5 时改用 Fisher 精确检验。
:::

## 资源与工具

<ResourceGrid :min="220">
  <ResourceCard
    name="pingouin"
    desc="Python 心理学统计包 · 卡方一行搞定，含效应量"
    href="https://pingouin-stats.org/"
    icon="🐧"
  />
  <ResourceCard
    name="JASP"
    desc="开源 GUI · 卡方分析含贝叶斯版本"
    href="https://jasp-stats.org/"
    icon="🧮"
  />
  <ResourceCard
    name="DescTools (R)"
    desc="一站式分类数据分析包 · 各种关联系数齐全"
    href="https://andrisignorell.github.io/DescTools/"
    icon="📦"
  />
  <ResourceCard
    name="Cohen (1988)"
    desc="效应量解读标尺的原始来源"
    href="https://www.utstat.toronto.edu/~brunner/oldclass/378f16/readings/CohenPower.pdf"
    icon="📏"
  />
</ResourceGrid>

## 延伸阅读

- Agresti, A. (2018). *An introduction to categorical data analysis* (3rd ed.). Wiley. ——分类数据分析的金标准教材，从卡方到 Logistic 回归到对数线性模型。
- Howell, D. C. (2013). *Statistical methods for psychology* (8th ed.), Chapter 6. ——心理学专业卡方入门最清晰的中级教材。
- Sharpe, D. (2015). Your chi-square test is statistically significant: Now what? *Practical Assessment, Research, and Evaluation, 20*(8). ——专门讲卡方显著之后该做什么的实操综述。
- Latané, B., & Darley, J. M. (1968). Group inhibition of bystander intervention in emergencies. *Journal of Personality and Social Psychology, 10*(3), 215–221. ——旁观者效应原始研究，本节例子改编自此。
