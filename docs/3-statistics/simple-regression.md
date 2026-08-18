---
title: 3.4.1 一元回归
description: 一元线性回归的原理与 SPSS/Python 实现
---

# 3.4.1 一元回归

::: tip 本节目标
读完本节后，你能把一个连续变量作为预测变量、另一个连续变量作为结果变量，写出一元线性回归方程；解释斜率、截距和 $R^2$；检查残差与影响点；并用 SPSS 或 Python 报告系数、置信区间和预测边界。
:::

<OutlineCard title="本节路线图">

- 概述：从相关到回归
- 一元回归模型
- 最小二乘法
- 模型拟合与诊断
- 软件实现

</OutlineCard>

## 概述

一元线性回归回答的是：在给定 $X$ 时，$Y$ 的条件均值如何变化、预测误差有多大？它把[相关分析](./correlation)的对称描述改成了有方向的建模语言：

$$
Y_i = \beta_0 + \beta_1X_i + \varepsilon_i,
\qquad
E(Y_i\mid X_i)=\beta_0+\beta_1X_i.
$$

这里的 $\beta_0,\beta_1$ 是总体参数，$\varepsilon_i$ 是不可直接观测的误差项，并假定 $E(\varepsilon_i\mid X_i)=0$。样本拟合后得到 $\hat Y_i=b_0+b_1X_i$，其中 $b_0,b_1$ 是参数估计值。“预测”是模型意义上的条件均值，不自动等于时间上的先后，更不等于因果效应。横断面或观察性数据应使用“关联”“预测”而不是“导致”。如果结果是二分类、计数或重复测量数据，应改用广义线性模型或多层模型，而不是硬套本页的普通最小二乘模型。

## 一元回归模型

### 系数怎么读

- **截距 $b_0$**：当 $X=0$ 时模型给出的平均 $Y$。若 $X=0$ 不在观测范围内，截距主要是数学定位，不宜做实质解释；可先中心化 $X$ 让截距代表平均 $X$ 时的预测值。
- **斜率 $b_1$**：$X$ 增加一个测量单位时，模型预测的 $Y$ 平均改变多少。正负号给方向，单位给尺度。斜率的 95% CI 比单独的 $p$ 值更能表达不确定性。
- **残差 $e_i$**：观测值与拟合值之差，即 $e_i=Y_i-\hat Y_i$。它是不可观测误差 $\varepsilon_i$ 的样本对应量，用于诊断，不能当作新的独立观测。

在含截距的一元模型中，标准化斜率 $\beta_{\mathrm{std}}$ 等于 Pearson $r$，$R^2=r^2$；这是一种数学换算，不改变研究问题，也不意味着相关分析可以替代预测诊断。

### 普通最小二乘的直觉

普通最小二乘（OLS）选择 $b_0,b_1$，使残差平方和最小：

$$
SSE=\sum_{i=1}^{n}(Y_i-\hat Y_i)^2.
$$

平方会放大大误差，所以极端点可能强烈影响直线。在模型可识别且 $E(\varepsilon\mid X)=0$ 时，OLS 系数对给定设计矩阵是无偏的；同方差且误差互不相关时，常规 OLS 协方差公式才适用。误差条件正态性进一步使小样本的经典 $t/F$ 检验和 CI 成为精确推断。OLS 不是“自动发现真实因果线”的算法。

## 假设、边界与诊断

### 需要检查什么

1. **线性均值结构**：$E(Y\mid X)$ 近似直线。先画散点图和残差-拟合值图；弯曲模式提示变换、二次项或非线性模型。
2. **误差相关结构**：经典标准误假定不同观测的误差互不相关。班级、家庭、被试内重复测量等数据不能按普通独立行推断，应按设计使用聚类稳健标准误、多层模型或 GEE。
3. **同方差**：给定 $X$ 后误差方差近似恒定。漏斗形残差会使经典 SE、CI 和 $p$ 值失真，可报告 HC3 稳健 SE 或重新建模；稳健 SE 不能修复非线性。
4. **误差条件正态性（关系到小样本精确推断）**：给定 $X$ 的误差正态性是经典 $t/F$ 检验和 CI 在有限样本中精确成立的条件；大样本推断可在更弱的正则条件下依靠渐近近似。它不要求 $X$ 或 $Y$ 的边际分布正态。实际用残差 Q-Q 图结合样本量和异常点诊断，不把 Shapiro-Wilk 的单个 $p$ 值当作通行证。
5. **无强影响点**：查看 leverage、Cook 距离和 DFBETAs。发现点后先核对录入和测量，再做“含/不含该点”的敏感性分析并报告规则；不要为了显著而删除。

### 报告哪些量

至少报告 $b_0,b_1$、各自 SE 或 95% CI、$t(df)$、$p$、$R^2$（可加 adjusted $R^2$）、样本量和诊断处理。若目标是个体预测，还要给新观测的**预测区间**；均值响应的 CI 会比个体预测区间窄，二者不要混写。$R^2$ 是样本内拟合比例，不是因果效应，也不保证样本外预测表现。

::: warning 常见误用
“斜率显著”只说明在模型和抽样假设下斜率与 0 不相容；它不证明 $X$ 导致 $Y$。不要把 $R^2$ 解释为“机制被解释了多少”，也不要在看到相关系数后跳过散点图和残差诊断。
:::

## 教学示例：同一份模拟数据

下面的 8 行是**教学模拟数据**，不是研究结果：$X=1,\ldots,8$，$Y=(2.1,2.9,4.2,5.1,5.8,7.2,7.9,9.1)$。用同一数据可核对 SPSS 与 Python 的模型。

::: code-group

```python [Python]
import numpy as np
import statsmodels.api as sm

x = np.arange(1, 9, dtype=float)
y = np.array([2.1, 2.9, 4.2, 5.1, 5.8, 7.2, 7.9, 9.1])
fit = sm.OLS(y, sm.add_constant(x)).fit()

print(fit.params.round(3))
print(fit.bse.round(3))
print(fit.tvalues.round(2), fit.df_resid)
print(fit.conf_int().round(3))
print(fit.rsquared.round(3), fit.rsquared_adj.round(3))
```

```text [SPSS syntax]
DATA LIST LIST / x y.
BEGIN DATA
1 2.1
2 2.9
3 4.2
4 5.1
5 5.8
6 7.2
7 7.9
8 9.1
END DATA.
REGRESSION
  /DEPENDENT y
  /METHOD=ENTER x
  /STATISTICS=COEFF OUTS R ANOVA CI(95).
```

:::

按 OLS 计算（截距、斜率、SE、$t$、95% CI；$df=6$）的结果为：

| 项目 | 估计 | SE | $t$ | 95% CI |
| --- | ---: | ---: | ---: | ---: |
| 截距 | 1.054 | 0.127 | 8.33 | [0.744, 1.363] |
| $X$ 斜率 | 0.996 | 0.025 | 39.77 | [0.935, 1.058] |

模型 $R^2=0.996$，adjusted $R^2=0.996$，$F(1,6)=1581.42$，$p<.001$，残差均方 $=0.0264$，RMSE $=0.162$。这些数值只描述这份模拟数据；不要把它们当作心理学效应大小。

## 从模型到论文

可按研究目的改写为：

> 一元线性回归显示，$X$ 与 $Y$ 呈正向关联，$b=0.996$，$SE=0.025$，$t(6)=39.77$，$p<.001$，95% CI [0.935, 1.058]，$R^2=.996$。该分析为观察性关联，不能单独支持因果解释。

如果 $X$ 来自随机操纵且设计、顺序和缺失处理支持因果识别，仍应把回归结果放回完整实验设计中解释，而不是仅凭显著性宣称因果。

## 资源与工具

<ResourceGrid :min="200">
  <ResourceCard
    name="statsmodels OLS"
    desc="Python 普通最小二乘 API（statsmodels 0.14.6，核查于 2026-08-12）"
    href="https://www.statsmodels.org/stable/generated/statsmodels.regression.linear_model.OLS.html"
    icon="🐍"
  />
  <ResourceCard
    name="Cohen et al. (2003)"
    desc="行为科学回归与相关分析教材"
    href="https://www.routledge.com/Applied-Multiple-RegressionCorrelation-Analysis-for-the-Behavioral-Sciences/Cohen-Cohen-West-Aiken/p/book/9780805822236"
    icon="📚"
  />
</ResourceGrid>

## 延伸阅读

- Cohen, J., Cohen, P., West, S. G., & Aiken, L. S. (2003). *Applied multiple regression/correlation analysis for the behavioral sciences* (3rd ed.). Routledge.
- Fox, J., & Weisberg, S. (2019). *An R companion to applied regression* (3rd ed.). Sage.
- Cook, R. D. (1977). Detection of influential observation in linear regression. *Technometrics, 19*(1), 15–18. https://doi.org/10.1080/00401706.1977.10489493
- White, H. (1980). A heteroskedasticity-consistent covariance matrix estimator and a direct test for heteroskedasticity. *Econometrica, 48*(4), 817–838. https://doi.org/10.2307/1912934
- MacKinnon, J. G., & White, H. (1985). Some heteroskedasticity-consistent covariance matrix estimators with improved finite sample properties. *Journal of Econometrics, 29*(3), 305–325. https://doi.org/10.1016/0304-4076(85)90158-7
