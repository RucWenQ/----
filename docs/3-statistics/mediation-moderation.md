---
title: 3.5 中介与调节
description: 用间接效应与交互项描述过程假设和条件效应
---

# 3.5 中介与调节

::: tip 本节目标
读完本节后，你能把过程假设写成中介模型、把条件效应写成调节模型；识别变量角色与观测结构；估计间接效应或交互项及其不确定性；并避免把横断面回归结果误写成因果机制。
:::

## 先分清两个问题

**中介**问的是：$X$ 与 $Y$ 的关系是否包含经由 $M$ 的间接路径？**调节**问的是：$X$ 与 $Y$ 的关系是否随 $W$ 的取值而变化？前者关注路径 $X\rightarrow M\rightarrow Y$，后者关注交互项 $XW$。二者都可用回归表达，但不能只凭显著性证明心理过程或因果机制。

开始分析前先写清：观测单位是谁、变量在哪一层测量、时间顺序如何、哪些变量被随机操纵、哪些混杂变量需要控制。若同一被试被重复测量，或被试嵌套在班级、团队中，独立观测假设不成立，应使用[多层模型](./multilevel)或其他与设计匹配的方法。

## 中介：估计间接效应

最简单的单一中介模型可写为：

$$
M=i_M+aX+e_M,
\qquad
Y=i_Y+c'X+bM+e_Y.
$$

$a$ 是 $X$ 与 $M$ 的条件关联，$b$ 是控制 $X$ 后 $M$ 与 $Y$ 的条件关联，$c'$ 是控制 $M$ 后的直接路径系数；只有在相应的因果识别假设成立时，才把它解释为直接效应。**间接效应**为 $ab$；同样，观察性数据中的 $ab$ 默认只是模型内的间接关联。在普通线性、无交互且方程尺度一致的模型里，总效应满足 $c=c'+ab$。这项分解不要求总效应 $c$ 先显著，也不应由“逐步检验每条路径”替代对 $ab$ 本身的推断。

由于 $a$ 与 $b$ 的乘积分布常不对称，报告 $ab$、其置信区间和所用方法；常用非参数 bootstrap 对分析单位重抽样并重新拟合两条方程。不要只报告 Sobel 检验或“完全/部分中介”标签。若数据有聚类、缺失、二分类结果或潜变量，重抽样单位和模型形式都要相应改变。

::: warning 因果中介需要额外假设
横断面数据中的 $ab$ 是模型内的间接关联，不能单独确定时间顺序，更不能排除 $M$ 与 $Y$ 的未测混杂。因果中介解释通常还要求处理与中介、处理与结果、中介与结果之间满足相应的无未测混杂条件，并正确处理处理后混杂。随机分配 $X$ 也不会自动随机化 $M$。应说明识别假设，并用纵向设计、操纵中介或敏感性分析增强论证。
:::

## 调节：解释交互而不是主效应

连续变量的线性调节模型为：

$$
Y=b_0+b_1X+b_2W+b_3XW+e.
$$

$b_3$ 是交互效应：$W$ 每增加一个单位，$X$ 的斜率改变 $b_3$。给定 $W=w$ 时，$X$ 的**条件效应**为 $b_1+b_3w$。因此，存在交互时，$b_1$ 只表示 $W=0$ 时的 $X$ 效应，不能解释成“总体主效应”。中心化能让 $W=0$ 更有意义并降低非本质共线性，但不会改变交互项检验，也不会修复异常值或非线性。

报告交互系数、SE、95% CI、$\Delta R^2$（相对不含交互项的模型）及其增量检验（如嵌套模型的 $F$ 检验），并报告条件效应。用有意义的 $W$ 值画预测线及置信带；可以报告预先指定分位点或 Johnson-Neyman 区间，但不要把连续调节变量切成“高/低组”。还要检查交互是否由少数高杠杆点、范围不足或遗漏的曲线关系造成。

## 教学示例：可核对的固定数据

下面是**教学模拟数据**，仅用来展示计算，不代表心理学效应。令 $X=(-1,-1,1,1)$、$M=(-2,0,0,2)$、$Y=(-5,-1,1,5)$。含截距的 OLS 计算得到：

- $M=X+e_M$，所以 $a=1$；
- $Y=X+2M+e_Y$，所以 $b=2$、$c'=1$；
- $Y=3X+e$，所以总效应 $c=3$；
- 间接效应 $ab=2$，且 $c=c'+ab=3$。

这组数据被刻意构造成结果方程 $Y=X+2M$ 的残差为 0，不能用于有效的结果方程标准误、置信区间或显著性检验。它只核对路径分解。真实研究应保留抽样误差并按观测单位 bootstrap；若研究问题是调节，则必须把 $X$、$W$ 和 $XW$ 同时放入模型并报告条件斜率。

## 分析与报告清单

1. 画出假设图并标明测量时间、分析单位、协变量和可能的混杂路径。
2. 先检查分布、缺失、异常点、线性与同方差；聚类或重复测量数据按层级建模。
3. 中介报告 $a,b,c',ab$ 及 $ab$ 的区间；调节报告 $b_3$、$\Delta R^2$、条件效应与预测图。
4. 做稳健性检查：替代变量顺序、遗漏混杂敏感性、异常点、非线性，以及不同协变量集合。
5. 观察性研究使用“间接关联”“条件关联”；只有设计与识别假设支持时才使用因果语言。

## 资源与工具

<ResourceGrid :min="200">
  <ResourceCard
    name="lavaan mediation"
    desc="路径模型、定义参数与 bootstrap 官方教程（核查于 2026-08-14）"
    href="https://lavaan.ugent.be/tutorial/mediation.html"
    icon="🧭"
  />
  <ResourceCard
    name="R mediation"
    desc="因果中介分析与敏感性分析软件说明"
    href="https://cran.r-project.org/package=mediation"
    icon="🧪"
  />
</ResourceGrid>

## 延伸阅读

- MacKinnon, D. P., Lockwood, C. M., Hoffman, J. M., West, S. G., & Sheets, V. (2002). A comparison of methods to test mediation and other intervening variable effects. *Psychological Methods, 7*(1), 83–104. https://doi.org/10.1037/1082-989X.7.1.83
- Preacher, K. J., & Hayes, A. F. (2008). Asymptotic and resampling strategies for assessing and comparing indirect effects in multiple mediator models. *Behavior Research Methods, 40*(3), 879–891. https://doi.org/10.3758/BRM.40.3.879
- Imai, K., Keele, L., & Tingley, D. (2010). A general approach to causal mediation analysis. *Psychological Methods, 15*(4), 309–334. https://doi.org/10.1037/a0020761
- Aiken, L. S., & West, S. G. (1991). *Multiple regression: Testing and interpreting interactions*. Sage.
