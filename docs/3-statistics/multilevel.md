---
title: 3.6 多层 / 混合效应模型
description: 为重复测量与嵌套数据建模固定效应和随机效应
---

# 3.6 多层 / 混合效应模型

::: tip 本节目标
读完本节后，你能识别重复测量与嵌套结构，区分固定效应和随机效应，解释 ICC 与跨层交互，选择与设计相符的随机效应结构，并报告估计、不确定性和模型诊断。
:::

## 为什么不能把每一行当作独立观测

日记数据中的天嵌套于人，学生嵌套于班级，员工嵌套于团队；同一上层单位内的观测往往更相似。普通回归若把这些行当作相互独立，通常会错误估计标准误，也无法把被试内变化与被试间差异分开。**多层模型**（或混合效应模型）显式描述这种相关结构。

先画数据层级图并定义观测单位。例如，$i$ 表示测量时点，$j$ 表示被试；若实验刺激交叉于被试而不是嵌套，还要考虑被试和刺激两个随机因素。只有一个被试或一个班级内变化的变量属于层 1，始终不变的被试属性属于层 2。

## 从空模型到随机斜率

连续结果的随机截距空模型为：

$$
Y_{ij}=\gamma_{00}+u_{0j}+e_{ij},
\qquad
u_{0j}\sim N(0,\tau_{00}),\quad e_{ij}\sim N(0,\sigma^2).
$$

$\gamma_{00}$ 是总体平均，$u_{0j}$ 是单位 $j$ 对总体平均的偏离。**组内相关系数**为

$$
ICC=\frac{\tau_{00}}{\tau_{00}+\sigma^2},
$$

表示总方差中归于上层单位差异的比例。ICC 不是决定“是否允许多层模型”的显著性门槛；观测结构由研究设计决定。

若层 1 预测变量 $X_{ij}$ 的效应允许因人而异，可写成：

$$
Y_{ij}=\gamma_{00}+\gamma_{10}X_{ij}+u_{0j}+u_{1j}X_{ij}+e_{ij}.
$$

$\gamma_{10}$ 是平均斜率，$u_{1j}$ 是各单位斜率偏离。随机截距与随机斜率可相关。随机效应不是“控制变量”；它们描述抽样单位间的变异分布。

## 区分层内效应与层间效应

对随时间变化的 $X_{ij}$，把它拆成个人均值 $\bar X_j$ 和个人均值中心化项 $X_{ij}-\bar X_j$：

$$
Y_{ij}=\gamma_{00}+\gamma_W(X_{ij}-\bar X_j)+\gamma_B\bar X_j+u_{0j}+e_{ij}.
$$

$\gamma_W$ 回答“同一个人在 $X$ 高于自己平常水平时，$Y$ 如何变化”；$\gamma_B$ 回答“平均 $X$ 较高的人，其平均 $Y$ 是否不同”。不拆分时，一个系数可能混合两种问题。跨层交互则检验层 2 变量是否改变层 1 斜率；解释时应给条件斜率和预测图。

## 建模、诊断与边界

1. **固定部分**：依据研究问题指定主效应、时间趋势和交互；避免仅凭逐步筛选决定模型。
2. **随机部分**：依据抽样与重复测量结构指定随机截距/斜率。随机结构过简可能低估不确定性，过复杂且信息不足会出现奇异拟合；应报告简化理由并做敏感性比较。
3. **估计方法**：比较不同固定效应时通常用最大似然（ML）；在固定部分相同时，限制最大似然（REML）常用于方差分量估计。软件默认值必须写清。
4. **诊断**：检查残差-拟合值图、Q-Q 图、单位级影响、时间相关和随机效应分布；“收敛”不等于模型正确。二分类或计数结果应使用广义混合模型。
5. **样本信息**：同时报告上层单位数和每个单位的观测数分布。大量行不能弥补上层单位过少；自由度和置信区间依赖所用近似。

::: warning 常见误用
不要把重复测量当作独立样本，不要只因 ICC 很小就忽略设计聚类，也不要把随机截距模型当作所有层级数据的默认终点。层 1 缺失若与未观测结果有关，混合模型的缺失处理仍可能有偏；应说明缺失机制假设并做敏感性分析。
:::

## 教学示例：ICC 的数值核对

下面是**教学模拟数据**。两个被试各有三次观测：A 为 $(1,2,3)$，B 为 $(5,6,7)$。总体均值为 4；被试均值为 2 和 6。

用随机截距的方差分解做直观核对：被试均值相对总体均值的平方偏差平均值为 $\tau_{00}=4$；六个观测相对各自被试均值的平方残差平均值为 $\sigma^2=2/3$。因此

$$
ICC=\frac{4}{4+2/3}=\frac{6}{7}\approx .857.
$$

这是为了核对公式而构造的平衡示例，不是用 REML 拟合得到的研究结果；不同方差估计量在如此小的样本下会给出不同数值。真实分析至少应报告固定效应、SE/CI、随机效应方差、残差方差、相关参数、估计法、软件版本、聚类数与每簇观测数。

```r
# lme4 2.0-6：随机截距与随机斜率模型（CRAN 版本核查于 2026-08-15）
library(lme4)

fit <- lmer(
  outcome ~ time_c * condition + (1 + time_c | person_id),
  data = dat,
  REML = FALSE
)
summary(fit)
isSingular(fit)
```

代码是执行模板，`dat` 需包含长格式真实数据，因此本次未声称运行输出。拟合后应检查收敛警告、奇异性、残差图与对高影响单位的敏感性，而不是只摘录系数表。

## 资源与工具

<ResourceGrid :min="200">
  <ResourceCard
    name="lme4"
    desc="R 线性与广义线性混合模型官方文档（2.0-6；CRAN 核查于 2026-08-15）"
    href="https://cran.r-project.org/package=lme4"
    icon="📐"
  />
  <ResourceCard
    name="performance"
    desc="模型诊断、ICC 与拟合检查工具（performance 0.17.1；CRAN 核查于 2026-08-15）"
    href="https://easystats.github.io/performance/"
    icon="🔍"
  />
</ResourceGrid>

## 延伸阅读

- Raudenbush, S. W., & Bryk, A. S. (2002). *Hierarchical linear models: Applications and data analysis methods* (2nd ed.). Sage.
- Snijders, T. A. B., & Bosker, R. J. (2012). *Multilevel analysis: An introduction to basic and advanced multilevel modeling* (2nd ed.). Sage.
- Bates, D., Mächler, M., Bolker, B., & Walker, S. (2015). Fitting linear mixed-effects models using lme4. *Journal of Statistical Software, 67*(1), 1–48. https://doi.org/10.18637/jss.v067.i01
- Barr, D. J., Levy, R., Scheepers, C., & Tily, H. J. (2013). Random effects structure for confirmatory hypothesis testing: Keep it maximal. *Journal of Memory and Language, 68*(3), 255–278. https://doi.org/10.1016/j.jml.2012.11.001
