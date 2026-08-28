---
title: 3.7 SEM / PLS-SEM
description: 从测量模型到结构路径，选择、拟合并解释结构方程模型
---

# 3.7 SEM / PLS-SEM

::: tip 本节目标
读完本节后，你能先判断研究问题是否需要 SEM，再把测量模型与结构路径分开，选择与数据类型匹配的估计方法，按顺序检查输出，并知道什么时候 PLS-SEM 的目标与协方差型 SEM 不同。
:::

## 先问：我真的需要 SEM 吗？

SEM 不是“有箭头的回归图”，而是一组把**测量模型**（题目如何反映构念）和**结构模型**（构念之间的关系）一起估计的方法。它最有用的场景是：一个心理构念由多个题目测量，而且你要同时检验多条路径、测量误差或跨组/跨时的约束。横断面数据中的路径仍然是条件关联；SEM 图本身不能提供时间顺序、随机化或无未测混杂。

先用下面的最短路径做选择：

| 你的问题 | 优先考虑 | 何时不要直接上 SEM |
| --- | --- | --- |
| 一个观测结果、几个观测预测变量 | 回归或广义线性模型 | 只有在题目测量误差或多个结果需要联合建模时再升级 |
| 多个题目测量“归属感”，并检验条件 → 归属感 → 帮助行为 | CFA + 结构路径（协方差型 SEM，CB-SEM） | 题目方向、缺失和观测单位还没检查时不要先看路径显著性 |
| 不知道题目究竟有几个因子 | EFA，然后用独立数据或预注册模型做 CFA | 不要在同一份数据上反复删题、加误差相关直到拟合变好 |
| 主要目标是样本外预测，或理论明确使用形成式/复合指标 | 可评估 PLS-SEM（也称 composite SEM） | 不要只因为样本小、模型复杂或 CB-SEM 拟合不佳就改用 PLS-SEM |
| 重复测量、班级/家庭嵌套或复杂抽样 | 纵向/多层/调查设计 SEM，或先用相应的混合模型 | 不能把所有行当作独立观测（参见[多层模型](./multilevel)） |

## 把模型拆成两部分

### 测量模型：题目是否测到了同一个构念

以“归属感”为例，单因子 CFA 可写成：

$$
x_j=\nu_j+\lambda_j\eta+\epsilon_j,
$$

其中 $x_j$ 是第 $j$ 个题目的得分，$\eta$ 是潜变量，$\lambda_j$ 是载荷，$\epsilon_j$ 是题目特有的误差。载荷表示题目与潜变量的线性关系，不等于题目的效度；高 alpha 也不能证明单维性。至少要先核对反向题、量尺方向、缺失编码和题目是否属于同一时间点。

### 结构模型：在测量误差之外检验路径

若实验条件 `condition` 预测归属感，归属感再预测帮助行为 `helping`，可写成：

$$
\eta=\alpha+\gamma\,\text{condition}+\zeta_\eta,
\qquad
\text{helping}=\beta_0+\beta_1\eta+\beta_2\,\text{condition}+\zeta_y.
$$

$\gamma$、$\beta_1$、$\beta_2$ 是在模型其他部分保持不变时的条件关系。只有当研究设计和识别假设支持因果解释时，才可以把它们写成因果效应；观察性横断面研究通常应写“关联”或“预测”。间接效应 $\gamma\beta_1$ 需要单独给出区间（常用 bootstrap），不能用两条路径各自显著来代替。

## 估计量怎么选

先写清每个指标的类型、类别数、分布和缺失，而不是先套软件默认值。

| 数据情形 | 常见起点 | 必须说明的边界 |
| --- | --- | --- |
| 连续指标，分布和样本量支持近似多元正态 | ML | 检查异常值、偏态和协方差矩阵；ML 不是“自动稳健” |
| 连续指标有偏态/峰度或异方差 | 稳健 ML（如 MLR，具体名称依软件而定） | 报告稳健标准误和相应的检验统计量，不要把普通 ML 的 $p$ 值混进来 |
| 有序分类题目（如 Likert） | 让软件把变量声明为 ordered，并使用 WLSMV/DWLS 等适合有序指标的估计量 | 类别少、分布偏斜和阈值稀疏会影响结果；不要默认把所有题目当连续正态 |
| 连续指标存在缺失 | 在 MCAR/MAR 等机制假设下使用 FIML 或多重插补 | FIML 不是“无缺失也适用”的魔法；有序指标的 FIML 支持依软件而异 |
| 重复测量、聚类或复杂抽样 | 多层/纵向/调查设计 SEM，或聚类稳健 SE | 先指定独立抽样单位和层级，再谈拟合与样本量 |

`lavaan` 官方教程明确：`ordered=` 会切换到 WLSMV；连续指标在 MCAR/MAR 假设下可用 `missing = "ML"` 做 full-information ML。不同软件对默认估计量、缺失处理和拟合指数的定义可能不同，所以报告软件、版本、估计量和缺失处理。

## 识别与排错：先让模型能被估计

**识别**是指样本信息足以唯一估计自由参数。潜变量必须有尺度：常见做法是把一个载荷固定为 1（marker-variable）或把因子方差固定为 1。自由度大于 0 只是必要线索，不保证模型实质上识别良好。

按这个顺序排错：

1. **检查模型语法和方向。** 每个题目只放在理论上应属的因子中；反向题先重编码；不要把同一题同时当作指标和结果变量。
2. **检查信息量。** 三个指标有时可以识别单因子，但小样本、近乎相同的题目、交叉载荷或误差相关仍可能导致不稳定；指标数量不是自动保证。
3. **看警告和参数。** 不收敛、负残差方差（Heywood case）、极大标准误、相关接近 $\pm1$ 或标准化载荷异常，都应回到量尺、模型和数据检查，而不是直接删掉警告。
4. **记录每次修改。** 修改指数只表示在当前模型下某个局部改动可能降低失配；它不是自动加误差相关的指令。探索性修改要在新数据或交叉验证中检验，并透明报告。

## 结果按五层阅读

不要只复制路径表。每次至少按下面五层检查：

1. **收敛与可接受解：** 是否有警告、负方差、不可解释的相关或极大的标准误。
2. **测量参数：** 报告非标准化和（必要时）标准化载荷、SE/95% CI、残差方差，并说明标准化方式。载荷高不等于构念已经有效；还要看内容效度和区分效度。
3. **整体拟合：** 同时报告 $\chi^2(df)$、CFI/TLI、RMSEA 及 CI、SRMR（若软件提供）。$\chi^2$ 对样本量敏感，CFI/TLI/RMSEA/SRMR 也各有定义和误差；Hu 与 Bentler 的经验 cutoff 不能当作普适“及格线”。
4. **局部失配：** 查看标准化残差、残差相关和理论上可能遗漏的路径。好的整体指数不能掩盖一条错误的载荷或一个负方差。
5. **结构与不确定性：** 报告路径估计、SE/CI、效应量和内生变量 $R^2$；间接效应给乘积和 bootstrap/稳健区间。跨组或跨时比较潜均值、载荷或路径前，要说明测量不变性约束。

::: warning 不要用单一阈值判生死
“CFI > .95 所以模型正确”或“$p>.05$ 所以模型被证明”都过度解读了拟合指数。把指数、参数、残差、理论和替代模型放在一起解释；拟合好只表示与协方差结构相容，不表示理论唯一或因果关系成立。
:::

## 教学示例：用 Python 从 CFA 走到 SEM

下面是一个**模拟的心理学教学数据集**：400 名参与者随机得到二元 `condition`，四个题目 `b1`–`b4` 测量“归属感”，`helping` 是连续帮助行为分数。数据完全由代码生成，不代表真实研究。示例限定为完整、连续、单层数据；它不替代有序题目、缺失或聚类数据的估计量选择。

### 1. 准备与拟合

本次按 `semopy 2.3.11`（PyPI 核查于 2026-08-22）运行。先在一个干净环境安装固定版本：

```bash
python -m pip install "semopy==2.3.11" "numpy==2.5.2" "pandas==3.0.5"
```

```python
import numpy as np
import pandas as pd
from semopy import Model, calc_stats

rng = np.random.default_rng(20260860)
n = 400
condition = rng.integers(0, 2, n)
belonging = 0.35 * condition + rng.normal(size=n)
dat = pd.DataFrame({"condition": condition})

# 四个题目的理论载荷分别为 .80、.75、.70、.65
for name, loading in {"b1": 0.80, "b2": 0.75,
                      "b3": 0.70, "b4": 0.65}.items():
    dat[name] = loading * belonging + rng.normal(
        scale=np.sqrt(1 - loading**2), size=n
    )
dat["helping"] = (
    0.50 * belonging + 0.20 * condition
    + rng.normal(scale=0.80, size=n)
)

def show_stats(fit):
    stats = calc_stats(fit).iloc[0]
    return stats[["chi2", "DoF", "chi2 p-value",
                  "CFI", "TLI", "RMSEA"]].round(3)

# 先只检验测量模型；四个指标留下 2 个自由度可供检验
cfa = Model("belonging =~ b1 + b2 + b3 + b4")
cfa.fit(dat)
print("CFA fit\n", show_stats(cfa))

# 再加入条件 → 潜变量和潜变量/条件 → 结果的结构路径
sem = Model("""
belonging =~ b1 + b2 + b3 + b4
belonging ~ condition
helping ~ belonging + condition
""")
sem.fit(dat)
print("SEM fit\n", show_stats(sem))

paths = sem.inspect(std_est=True)
print(paths.loc[paths["op"] == "~",
                ["lval", "rval", "Estimate", "Est. Std", "p-value"]]
      .round(3).to_string(index=False))
```

代码各部分的作用是：`=~` 定义潜变量与指标，`~` 定义回归路径；先 `cfa.fit()` 是为了在解释结构路径前检查测量部分；`calc_stats()` 提取该软件实现的整体指数；`inspect(std_est=True)` 同时给出原始和标准化参数。`semopy` 的这段示例使用默认的 MLW 目标函数和完整数据；不要把它当作稳健 ML 或 WLSMV 的示范。

### 2. 预期输出与阅读

在 Python 3.12.13、NumPy 2.5.2、pandas 3.0.5、SciPy 1.18.1、semopy 2.3.11 下，核心输出为（四舍五入）：

```text
CFA: chi2=2.904, df=2, p=.234, CFI=.998, TLI=.995, RMSEA=.034
SEM: chi2=12.745, df=9, p=.174, CFI=.995, TLI=.991, RMSEA=.032

condition -> belonging:  b=.319, std=.193, p<.001
b1 -> belonging:          std=.773
b2 -> belonging:          std=.781
b3 -> belonging:          std=.764
b4 -> belonging:          std=.679
belonging -> helping:     b=.646, std=.536, p<.001
condition -> helping:     b=.087, std=.043, p=.330
```

这组模拟结果说明：四个题目与归属感的标准化载荷约为 .68–.78；在同时放入归属感后，条件到帮助行为的直接路径在本次模拟中不显著。它**不**说明实验条件在真实研究中没有总效应，也不提供中介效应的置信区间；若要报告间接效应，应在同一模型中计算乘积并用 bootstrap 或适合估计量的区间。`semopy` 的 `calc_stats()` 未在这段输出中列出 SRMR，因此正式报告应改用能给出 SRMR 的工具（例如 `lavaan` 的 `lavResiduals()`），或按工具文档核对其计算方式，而不能把缺少一个指数当作“拟合良好”。

### 3. 从输出到报告

可以按下面的顺序写结果，而不是只贴软件截图：

> 在完整模拟数据上，四指标单因子 CFA 的拟合为 $\chi^2(2)=2.90, p=.234$，CFI=.998，TLI=.995，RMSEA=.034。加入结构路径后，模型拟合为 $\chi^2(9)=12.75, p=.174$，CFI=.995，TLI=.991，RMSEA=.032。归属感对帮助行为的标准化路径为 $\beta=.536$；条件对归属感的标准化路径为 $\beta=.193$。这些是模拟数据中的条件关联，不能单凭 SEM 图作因果推断。

真实研究还要补上估计量、缺失处理、样本量/聚类数、测量不变性（若比较群体）、标准化方式、残差诊断和间接效应区间。

## CB-SEM 与 PLS-SEM：目标不同，不能互换

本页的测量—结构流程主要是**协方差型 SEM（CB-SEM）**：估计参数并检验模型隐含的协方差结构，适合理论驱动的测量模型和整体拟合评估。**PLS-SEM**以成分/复合指标和预测为核心，形成式构念、预测目标和样本外验证可能使它成为候选方法；它的算法、目标函数和“拟合”概念与 CB-SEM 不同。

选择 PLS-SEM 前写下三件事：

1. 预测目标是什么，训练/验证或交叉验证怎么划分；
2. 每个构念是反映式还是形成式，指标方向和测量质量如何评估；
3. 将报告哪些样本外预测指标、稳定性检查和替代模型。

“样本小”“CB-SEM 拟合不好”“路径想要显著”都不是单独的充分理由。PLS-SEM 的载荷、路径和预测表现也不能直接当作 CB-SEM 的等价证据。

## 一页工作清单

1. 写研究问题、观测单位、时间点和指标类型；决定是回归、混合模型、CB-SEM 还是 PLS-SEM。
2. 预先画测量和结构部分，标记固定参数、自由参数和可能的替代模型。
3. 清理题目方向、缺失、异常值和量尺；按变量类型选择估计量并记录软件版本。
4. 先拟合测量模型，再看载荷、残差、区分效度和识别；确认可接受解后才解释结构路径。
5. 同时报告全局拟合、局部残差、参数/CI、效应量、$R^2$、聚类信息和敏感性分析。
6. 将探索性修改与验证性检验分开；保存语法、数据版本、输出和随机种子。

## 资源与工具

<ResourceGrid :min="200">
  <ResourceCard
    name="semopy"
    desc="Python SEM 官方文档与拟合指数（2.3.11；核查于 2026-08-22）"
    href="https://semopy.com/"
    icon="🐍"
  />
  <ResourceCard
    name="lavaan"
    desc="R 中 CFA/SEM 官方教程（CRAN 0.7-2；核查于 2026-08-22）"
    href="https://lavaan.ugent.be/tutorial/"
    icon="🧱"
  />
  <ResourceCard
    name="lavaan 估计量"
    desc="MLR、WLSMV、有序题目与缺失处理边界"
    href="https://lavaan.ugent.be/tutorial/est.html"
    icon="⚙️"
  />
  <ResourceCard
    name="semTools"
    desc="测量不变性、信度与 SEM 辅助工具（0.5-9；核查于 2026-08-22）"
    href="https://cran.r-project.org/package=semTools"
    icon="🧰"
  />
</ResourceGrid>

## 延伸阅读

- Bollen, K. A. (1989). *Structural equations with latent variables*. Wiley. https://doi.org/10.1002/9781118619179
- Kline, R. B. (2023). *Principles and practice of structural equation modeling* (5th ed.). Guilford Press. ISBN 9781462551910. [出版社页面](https://www.guilford.com/books/Principles-and-Practice-of-Structural-Equation-Modeling/Rex-Kline/9781462551910)
- Hair, J. F., Jr., Hult, G. T. M., Ringle, C. M., & Sarstedt, M. (2021). *A primer on partial least squares structural equation modeling (PLS-SEM)* (3rd ed.). SAGE. ISBN 9781544396408. [出版社页面](https://www.sagepub.com/shop/buy-a-book/a-primer-on-partial-least-squares-structural-equation-modeling-pls-sem-3-270548)
- Rosseel, Y. (2012). lavaan: An R package for structural equation modeling. *Journal of Statistical Software, 48*(2). https://doi.org/10.18637/jss.v048.i02
- Hu, L., & Bentler, P. M. (1999). Cutoff criteria for fit indexes in covariance structure analysis: Conventional criteria versus new alternatives. *Structural Equation Modeling, 6*(1), 1–55. https://doi.org/10.1080/10705519909540118
- Marsh, H. W., Hau, K.-T., & Wen, Z. (2004). In search of golden rules: Comment on hypothesis-testing approaches to setting cutoff values for fit indexes and dangers in overgeneralizing Hu and Bentler's findings. *Structural Equation Modeling, 11*(3), 320–341. https://doi.org/10.1207/S15328007SEM1103_2
- Rhemtulla, M., Brosseau-Liard, P. É., & Savalei, V. (2012). When can categorical variables be treated as continuous? *Psychological Methods, 17*(3), 354–373. https://doi.org/10.1037/a0029315
- Muthén, L. K., & Muthén, B. O. (2002). How to use a Monte Carlo study to decide on sample size and determine power. *Structural Equation Modeling, 9*(4), 599–620. https://doi.org/10.1207/S15328007SEM0904_8
