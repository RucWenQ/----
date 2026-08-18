---
title: 3.4.2 多元回归
description: 多元线性回归的原理与 SPSS/Python 实现
---

# 3.4.2 多元回归

::: tip 本节目标
读完本节后，你能在一个连续结果上同时纳入多个预测变量，解释“在模型中的其他预测变量相同”这一条件含义；用 $R^2$、增量 $\Delta R^2$ 和部分效应量比较模型；诊断共线性、残差和影响点；并写出不夸大因果的回归报告。
:::

<OutlineCard title="本节路线图">

- 概述：为什么需要多个自变量
- 多元回归模型
- 共线性诊断
- 模型选择与比较
- 软件实现

</OutlineCard>

## 概述

**多元线性回归**回答的是：多个 $X$ 联合起来能否预测连续的 $Y$，以及在模型中的其他预测变量固定时，某个 $X_j$ 还与 $Y$ 有多少线性关联？观测单位可以是人、家庭或其他独立单位；重复测量、班级/团队嵌套和时间序列不能当作普通独立行处理。

$$
Y_i=\beta_0+\beta_1X_{1i}+\cdots+\beta_kX_{ki}+\varepsilon_i,
\qquad E(\varepsilon_i\mid X_{1i},\ldots,X_{ki})=0.
$$

这里的 $\beta_j$ 是总体参数，样本拟合式 $\hat Y_i=b_0+b_1X_{1i}+\cdots+b_kX_{ki}$ 中的 $b_j$ 是其估计值。$b_j$ 表示**条件关联**：在模型包含的其他 $X$ 取相同值的比较下，$X_j$ 增加一个单位时，模型预测的 $Y$ 条件均值改变 $b_j$。它不是“控制后得到的因果效应”；遗漏混杂、反向因果、测量误差和选择偏差仍会影响解释。

## 模型、效应量与模型比较

### 先写清研究问题

- 若问题是“这些变量联合预测 $Y$ 吗”，关注整体 $F$ 检验、$R^2$ 及其不确定性。
- 若问题是“加入一组理论上预先指定的变量后，样本内拟合增加多少”，比较嵌套模型的 $\Delta R^2$ 和增量 $F$，而不是事后不断尝试变量组合。样本外预测是否改善要另用验证集或交叉验证评估。
- 若问题是“某个 $X_j$ 在其他变量相同下是否有独立关联”，报告 $b_j$、95% CI、$t(df)$、$p$，并同时给出变量尺度。

常用效应量包括：

- $R^2=1-SSE/SST$：样本内结果变异的拟合比例；adjusted $R^2$ 对参数数量做惩罚，但也不是样本外预测保证。
- 分块增量效应 $f^2=\Delta R^2/(1-R^2_{full})$：只在比较嵌套模型、且变量块事先有理论理由时解释。
- 对普通 OLS 中单个系数的 $t$ 检验，部分 $R^2=t^2/(t^2+df_{resid})$；它表示该变量在其他预测变量之外解释的局部变异比例，不等同于零阶相关。

::: warning 不要把“控制变量”写成因果保证
把年龄、性别或基线分数放进回归，只表示在这些变量取相同值的模型比较；若它们是碰撞变量、处理后的变量或测量误差很大，调整反而可能引入偏差。控制集应由因果图、研究设计或预注册方案说明。
:::

## 共线性、假设与诊断

### 共线性

预测变量之间高度相关时，模型整体可能拟合很好，但单个 $b_j$ 的 SE 变大、符号不稳定。对每个预测变量计算 VIF：

$$
VIF_j=\frac{1}{1-R_j^2},
$$

其中 $R_j^2$ 来自“用其他预测变量预测 $X_j$”的辅助回归。VIF 没有跨领域通用的硬阈值；较大的值应结合变量含义、估计目标、CI 宽度和敏感性分析判断。不要只因超过某个经验线就机械删除理论上重要的变量，也不要把共线性误写成因果冲突。

### 线性模型诊断

1. **线性与同方差**：残差-拟合值图、部分残差图；曲线或漏斗形提示函数形式或方差问题。
2. **独立性**：按研究设计检查重复测量、群组和时间顺序；必要时使用多层模型或聚类稳健 SE。
3. **残差分布**：Q-Q 图看尾部和系统偏离。正态性主要影响小样本的精确推断，不要求每个原始变量正态。
4. **影响点**：leverage、Cook 距离、DFBETAs。核对录入后做含/不含点的敏感性分析，完整报告决定。
5. **缺失与测量**：说明缺失机制、剔除/插补规则和量表信度；回归不会自动修复测量误差或选择偏差。

异方差时可报告 HC3 稳健协方差（MacKinnon & White, 1985；它改变 SE/CI，不改变 OLS 点估计）；非线性、嵌套或二分类结果则需要改变模型，而不是只换标准误。

## 教学示例：三变量预测

以下是**教学模拟数据**（15 个独立观测），变量为压力 `stress`、社会支持 `support`、睡眠时长 `sleep`，结果为幸福感 `wellbeing`。数值由固定公式加小扰动生成，仅用于核对代码和解释尺度。

::: code-group

```python [Python]
import numpy as np
import pandas as pd
import statsmodels.api as sm
from statsmodels.stats.outliers_influence import variance_inflation_factor

stress  = [2,3,4,5,6,7,8,2.5,4.5,6.5,7.5,3.5,5.5,1.5,8.5]
support = [8,7,6,5,4,3,2,5,8,6,3,7,4,9,5]
sleep   = [7,6,8,5,6,4,5,7,6,7,5,8,6,7,4]
noise   = [-1.2,0.8,-0.5,1.1,-0.7,0.4,-1.0,0.6,1.2,-0.9,0.3,-0.4,0.9,-0.6,0.2]
wellbeing = [30 - 1.4*s + 1.1*u + 0.8*z + e
             for s, u, z, e in zip(stress, support, sleep, noise)]
df = pd.DataFrame({"wellbeing": wellbeing, "stress": stress,
                   "support": support, "sleep": sleep})
X = sm.add_constant(df[["stress", "support", "sleep"]])
fit = sm.OLS(df["wellbeing"], X).fit()
print(fit.params.round(3))
print(fit.conf_int().round(3))
print(fit.rsquared.round(3), fit.rsquared_adj.round(3), fit.df_resid)
print([variance_inflation_factor(X.values, i)
       for i in range(1, X.shape[1])])
# 若残差方差不齐，可把 .fit() 改为 .fit(cov_type="HC3")
```

```text [SPSS syntax]
DATA LIST LIST / wellbeing stress support sleep.
BEGIN DATA
40.4 2 8 7
39.1 3 7 6
36.9 4 6 8
33.6 5 5 5
30.1 6 4 6
27.1 7 3 4
24.0 8 2 5
38.2 2.5 5 7
38.5 4.5 8 6
32.2 6.5 6 7
27.1 7.5 3 5
38.8 3.5 7 8
32.4 5.5 4 6
42.8 1.5 9 7
27.0 8.5 5 4
END DATA.
REGRESSION
  /DEPENDENT wellbeing
  /METHOD=ENTER stress support sleep
  /STATISTICS=COEFF OUTS R ANOVA CI(95) COLLIN TOL.
```

:::

按普通 OLS（$df_{resid}=11$）核对得到：

| 变量 | $b$ | SE | $t$ | 95% CI | $p$ |
| --- | ---: | ---: | ---: | ---: | ---: |
| 截距 | 33.968 | 2.375 | 14.30 | [28.740, 39.197] | < .001 |
| 压力 | -1.598 | 0.173 | -9.21 | [-1.979, -1.216] | < .001 |
| 社会支持 | 1.083 | 0.163 | 6.63 | [0.724, 1.443] | < .001 |
| 睡眠 | 0.326 | 0.239 | 1.37 | [-0.199, 0.851] | .199 |

整体 $R^2=.986$，adjusted $R^2=.982$，$F(3,11)=255.95$，$p<.001$。三个预测变量的 VIF 约为 3.42、2.59、2.12；这不是自动“合格/不合格”的判定，而是提示应结合 CI 和理论解释。该示例中睡眠的条件斜率不显著，不等于睡眠“没有作用”；它表示在这组小型模拟数据和同时纳入压力、支持后，不确定性仍覆盖 0。

## 模型选择与报告

优先按理论或预注册顺序建立少量嵌套模型，例如先放设计必需的协变量，再加入主要预测变量，报告 $\Delta R^2$ 及其不确定性（可得时给 CI），并给出增量 $F$、自由度和 $p$ 值。不要用逐步筛选、反复试模型直到 $p<.05$；这会放大乐观偏差。若目标是预测，应留出验证集或使用交叉验证，并报告样本外误差（RMSE/MAE），不能只报告训练集 $R^2$。

APA 风格可以写成：

> 多元回归模型显著，$F(3,11)=255.95$，$p<.001$，$R^2=.986$，adjusted $R^2=.982$。在模型中的其他变量相同的条件下，压力与幸福感负相关，$b=-1.598$，$SE=0.173$，$t(11)=-9.21$，$p<.001$，95% CI [-1.979, -1.216]。这是模拟数据的条件关联，不作因果解释。

## 资源与工具

<ResourceGrid :min="200">
  <ResourceCard
    name="statsmodels OLS"
    desc="Python 回归、稳健协方差与诊断 API（statsmodels 0.14.6，核查于 2026-08-13）"
    href="https://www.statsmodels.org/stable/regression.html"
    icon="🐍"
  />
  <ResourceCard
    name="VIF 官方 API"
    desc="statsmodels 的方差膨胀因子计算"
    href="https://www.statsmodels.org/stable/generated/statsmodels.stats.outliers_influence.variance_inflation_factor.html"
    icon="🔎"
  />
  <ResourceCard
    name="Cohen et al. (2003)"
    desc="行为科学多元回归与效应量"
    href="https://www.routledge.com/Applied-Multiple-RegressionCorrelation-Analysis-for-the-Behavioral-Sciences/Cohen-Cohen-West-Aiken/p/book/9780805822236"
    icon="📚"
  />
</ResourceGrid>

## 延伸阅读

- Cohen, J., Cohen, P., West, S. G., & Aiken, L. S. (2003). *Applied multiple regression/correlation analysis for the behavioral sciences* (3rd ed.). Routledge.
- Harrell, F. E. (2015). *Regression modeling strategies* (2nd ed.). Springer. https://doi.org/10.1007/978-3-319-19425-7
- O'Brien, R. M. (2007). A caution regarding rules of thumb for variance inflation factors. *Quality & Quantity, 41*, 673–690. https://doi.org/10.1007/s11135-006-9018-6
- White, H. (1980). A heteroskedasticity-consistent covariance matrix estimator and a direct test for heteroskedasticity. *Econometrica, 48*(4), 817–838. https://doi.org/10.2307/1912934
- MacKinnon, J. G., & White, H. (1985). Some heteroskedasticity-consistent covariance matrix estimators with improved finite sample properties. *Journal of Econometrics, 29*(3), 305–325. https://doi.org/10.1016/0304-4076(85)90158-7
