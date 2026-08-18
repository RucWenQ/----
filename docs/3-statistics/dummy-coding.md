---
title: 3.4.3 哑变量回归
description: 分类自变量的回归编码与 ANOVA = 回归的等价性
---

# 3.4.3 哑变量回归

::: tip 本节目标
读完本节后，你能把 $k$ 水平的分类预测变量编码为 $k-1$ 列，解释参考组、截距和各组差异；说明单因素 ANOVA 与同一设计矩阵下的 OLS 回归何时等价；选择处理编码或计划对比；并报告组差异、置信区间、整体检验和效应量。
:::

<OutlineCard title="本节路线图">

- 概述：把分类变量装进回归
- 哑变量编码方式
- ANOVA = 回归的等价证明
- 含哑变量的多元回归
- 软件实现

</OutlineCard>

## 概述

线性回归的预测变量不必都是连续数值。分类变量没有自然的数值距离，必须先转换为**哑变量**（indicator/dummy variables）或对比编码。对一个有 $k$ 个水平的变量，在包含截距的模型中只放 $k-1$ 列；把全部 $k$ 列与截距同时放入会形成完全共线性，也就是“dummy-variable trap”。

本页仍假定结果变量连续、各行观测独立、组内误差结构适合 OLS。若结果是二分类，应使用 logistic 回归；若同一被试多次进入不同条件，应使用重复测量或混合效应模型。

## 处理编码：每个系数都和参考组比较

设条件有“对照”“文字”“视频”三组，以对照组为参考，定义：

| 组别 | $D_{text}$ | $D_{video}$ |
| --- | ---: | ---: |
| 对照 | 0 | 0 |
| 文字 | 1 | 0 |
| 视频 | 0 | 1 |

回归模型为：

$$
Y=b_0+b_1D_{text}+b_2D_{video}+\varepsilon.
$$

- $b_0=\bar Y_{control}$：参考组均值。
- $b_1=\bar Y_{text}-\bar Y_{control}$：文字组与对照组的均值差。
- $b_2=\bar Y_{video}-\bar Y_{control}$：视频组与对照组的均值差。

截距和系数的含义由编码决定。改变参考组会改变参数表，但不会改变拟合值、残差、整体 $F$、$R^2$ 或同一组均值。要比较视频与文字，可以更换参考组，或直接检验线性对比 $b_2-b_1$。

::: warning 不要给类别直接编号后当连续变量
把三组写成 1、2、3 并直接回归，会强迫模型假定“1 到 2”和“2 到 3”的间隔相同且只有一条线性趋势。除非这正是事先定义的有序趋势假设，否则应使用 $k-1$ 列编码或明确的对比。
:::

## ANOVA 与回归何时等价

对独立组、连续结果和同一组观测，如果 ANOVA 与 OLS 回归使用相同的设计矩阵、最小二乘估计、截距和误差假设，则：

- 回归预测值就是各组样本均值；
- 回归的模型平方和等于单因素 ANOVA 的组间平方和；
- 整体回归 $F$ 与单因素 ANOVA 的总体 $F$ 相同；
- 单因素模型的 $R^2=SS_{between}/SS_{total}=\eta^2$。

这项等价不表示所有 ANOVA 与所有回归输出都无条件相同。多因素且不平衡的数据中，Type I/II/III 平方和检验的是不同问题；对比编码、交互项、缺失值筛选和稳健标准误也会改变具体检验。Welch ANOVA 与经典等方差 OLS 的 $F$ 同样不是一回事。

## 其他编码与计划对比

| 编码 | 截距常见含义 | 系数回答的问题 | 适合场景 |
| --- | --- | --- | --- |
| 处理/哑变量编码 | 参考组均值 | 各组 vs. 参考组 | 有明确基准组 |
| 和编码（sum coding） | 各水平的非加权总体均值（平衡设计时等于总均值） | 各水平相对该均值 | 关注总体偏离 |
| 计划对比 | 由对比矩阵决定 | 事先指定的科学比较 | 例如两种干预平均 vs. 对照 |

对比权重应对应研究问题并在看结果前确定。若同一组均值上检验多个事后比较，要说明多重比较控制方法；“换几个参考组直到有显著结果”仍是多重检验。

## 含哑变量的多元回归

分类变量可以与连续协变量共同进入模型：

$$
Y=b_0+b_1D_{text}+b_2D_{video}+b_3X+\varepsilon.
$$

这时 $b_1,b_2$ 是在模型中的 $X$ 相同时的**调整后组差异**。若各组中 $X$ 与 $Y$ 的斜率不同，应事先考虑 $D\times X$ 交互；没有交互的 ANCOVA 模型隐含平行斜率。观察性分组即使调整协变量，也不能自动获得随机实验的因果解释。

## 假设、诊断与报告

与[多元回归](./multiple-regression)相同，需要检查线性均值结构、独立性、同方差、残差尾部和影响点。分类预测变量下尤其要看每组样本量、每组残差分布和组间方差；极小组会让系数 CI 很宽。异方差时可以使用 HC3 稳健 SE，或在纯组间均值问题中考虑 Welch ANOVA；不要只因 Levene 检验显著/不显著就自动切换方法。

最低报告集合：每组 $n$、均值与 SD，整体 $F(df_1,df_2)$、$p$、$R^2/\eta^2$（可加 $\omega^2$），每个计划比较的均值差、SE、95% CI、$p$ 及多重比较处理。系数表必须写明参考组或对比编码。

## 教学示例：三组条件

以下是**教学模拟数据**，每组 5 个独立观测：对照组 `[12,13,11,14,10]`，文字组 `[15,16,14,17,15]`，视频组 `[18,17,19,20,18]`。

::: code-group

```python [Python]
import pandas as pd
import statsmodels.formula.api as smf
from statsmodels.stats.anova import anova_lm

df = pd.DataFrame({
    "condition": ["control"]*5 + ["text"]*5 + ["video"]*5,
    "score": [12,13,11,14,10, 15,16,14,17,15, 18,17,19,20,18]
})
fit = smf.ols(
    "score ~ C(condition, Treatment(reference='control'))", data=df
).fit()
print(df.groupby("condition")["score"].agg(["count", "mean", "std"]))
print(fit.params.round(3))
print(fit.conf_int().round(3))
print(anova_lm(fit))
```

```text [SPSS syntax]
DATA LIST LIST / condition score.
BEGIN DATA
0 12
0 13
0 11
0 14
0 10
1 15
1 16
1 14
1 17
1 15
2 18
2 17
2 19
2 20
2 18
END DATA.
COMPUTE text  = (condition = 1).
COMPUTE video = (condition = 2).
EXECUTE.
REGRESSION
  /DEPENDENT score
  /METHOD=ENTER text video
  /STATISTICS=COEFF OUTS R ANOVA CI(95).
```

:::

三组均值依次为 12.0、15.4、18.4。以对照组为参考时：

| 参数 | $b$ | SE | $t(12)$ | 95% CI | $p$ |
| --- | ---: | ---: | ---: | ---: | ---: |
| 截距（对照组均值） | 12.0 | 0.583 | 20.58 | [10.730, 13.270] | < .001 |
| 文字 - 对照 | 3.4 | 0.825 | 4.12 | [1.603, 5.197] | .001 |
| 视频 - 对照 | 6.4 | 0.825 | 7.76 | [4.603, 8.197] | < .001 |

整体检验 $F(2,12)=30.16$，$p<.001$，$R^2=\eta^2=.834$，$\omega^2=.795$。$R^2$ 较大只说明这份模拟数据中的组均值分离明显；它不证明现实研究中的干预有效。

报告时可以写：

> 以对照组为参考的回归显示，文字组得分平均高 3.40 分，$SE=0.82$，$t(12)=4.12$，$p=.001$，95% CI [1.60, 5.20]；视频组平均高 6.40 分，$SE=0.82$，$t(12)=7.76$，$p<.001$，95% CI [4.60, 8.20]。整体模型 $F(2,12)=30.16$，$p<.001$，$R^2=.834$。数据为教学模拟，不作实质推断。

## 资源与工具

<ResourceGrid :min="200">
  <ResourceCard
    name="Patsy contrasts"
    desc="statsmodels 公式中的处理、和与自定义对比（核查于 2026-08-12）"
    href="https://www.statsmodels.org/stable/contrasts.html"
    icon="🧩"
  />
  <ResourceCard
    name="Schad et al. (2020)"
    desc="线性与混合模型中的先验对比教程"
    href="https://doi.org/10.1016/j.jml.2019.104038"
    icon="📖"
  />
  <ResourceCard
    name="Cohen et al. (2003)"
    desc="分类预测变量、交互与多元回归"
    href="https://www.routledge.com/Applied-Multiple-RegressionCorrelation-Analysis-for-the-Behavioral-Sciences/Cohen-Cohen-West-Aiken/p/book/9780805822236"
    icon="📚"
  />
</ResourceGrid>

## 延伸阅读

- Wilkinson, G. N., & Rogers, C. E. (1973). Symbolic description of factorial models for analysis of variance. *Applied Statistics, 22*(3), 392–399. https://doi.org/10.2307/2346786
- Schad, D. J., Vasishth, S., Hohenstein, S., & Kliegl, R. (2020). How to capitalize on a priori contrasts in linear (mixed) models: A tutorial. *Journal of Memory and Language, 110*, 104038. https://doi.org/10.1016/j.jml.2019.104038
- Cohen, J., Cohen, P., West, S. G., & Aiken, L. S. (2003). *Applied multiple regression/correlation analysis for the behavioral sciences* (3rd ed.). Routledge.
