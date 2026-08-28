---
title: 3.9 贝叶斯统计入门
description: 用先验、似然和后验更新不确定性，并读懂可信区间与贝叶斯因子
---

# 3.9 贝叶斯统计入门

::: tip 本节目标
读完本节后，你能把研究问题写成参数与数据，说明先验从哪里来，计算并解释后验分布和可信区间，区分“参数落在区间内”的概率与频率学派置信区间，并知道何时需要敏感性分析或请统计顾问复核。
:::

## 你想知道的概率是什么？

频率学派通常把参数视为固定、把重复抽样产生的区间视为随机；贝叶斯分析把**参数的不确定性**表示为概率分布。核心更新式是：

$$
p(\theta\mid y)\propto p(y\mid\theta)\,p(\theta),
$$

也就是“后验 ∝ 似然 × 先验”。这不是把主观意见伪装成事实：先验必须公开、可辩护，并做敏感性检查。贝叶斯方法适合需要直接概率陈述、层级/缺失模型或小样本正则化的场景；若先验无法说明、模型预测检查没有做，或读者/期刊只接受另一套报告规范，应先与导师或统计顾问确认。

## 最短决策路径

1. 写出**估计对象**（如控制条件下助人比例 $p$、组间差异 $\delta$ 或回归斜率 $\beta$）和观测单位。
2. 选择似然：二分类→Bernoulli/binomial，计数→Poisson/负二项，连续结果→正态或更合适的分布；重复测量/班级嵌套要加入层级结构。
3. 给先验：用量表范围、已有研究或弱信息先验表达合理范围；把尺度和方向写出来。
4. 拟合后验并检查收敛、后验预测和先验敏感性；再报告估计、95% 可信区间和实际等价/决策概率。

## 一个可核对的共轭例子（模拟数据）

假设你观察到 30 名参与者中有 18 人在帮助任务中选择帮助。这是**模拟的二分类教学数据**，不是实证结果。令 $y\sim\text{Binomial}(n,p)$，对帮助概率使用均匀先验 $p\sim\text{Beta}(1,1)$，则后验为：

$$
p\mid y\sim\text{Beta}(1+18,\;1+30-18)=\text{Beta}(19,13).
$$

后验均值是 $19/(19+13)=0.594$。用 Beta 分布的 2.5% 和 97.5% 分位数得到 95% 可信区间 [0.422, 0.755]：在给定模型、数据和先验后，参数 $p$ 落在这个区间的后验概率为 95%。它不是“重复抽样构造的区间有 95% 机会覆盖固定参数”。

下面的 Node.js 代码用数值积分复核后验均值和分位数；换成正式项目时，使用 Stan/brms、PyMC 或 JAGS，并固定软件与采样器版本。

```javascript
// Node.js 18+；Beta(19,13) 的教学核对，不含真实参与者数据
const a = 19, b = 13;
const logGamma = z => {
  const c = [676.5203681218851, -1259.1392167224028,
    771.32342877765313, -176.61502916214059, 12.507343278686905,
    -0.13857109526572012, 9.984369578019572e-6, 1.5056327351493116e-7];
  if (z < 0.5) return Math.log(Math.PI) - Math.log(Math.sin(Math.PI * z)) - logGamma(1 - z);
  z -= 1; let x = 0.9999999999998099;
  c.forEach((v, i) => { x += v / (z + i + 1); });
  const t = z + c.length - 0.5;
  return 0.5 * Math.log(2 * Math.PI) + (z + 0.5) * Math.log(t) - t + Math.log(x);
};
const pdf = x => Math.exp((a - 1) * Math.log(x) + (b - 1) * Math.log(1 - x)
  - logGamma(a) - logGamma(b) + logGamma(a + b));
const cdf = x => { // Simpson 积分
  const n = 10000, h = x / n; let s = 0;
  for (let i = 0; i <= n; i++) {
    const f = pdf(i * h);
    s += f * (i === 0 || i === n ? 1 : (i % 2 ? 4 : 2));
  }
  return s * h / 3;
};
const quantile = p => { let lo = 1e-8, hi = 1 - 1e-8;
  for (let i = 0; i < 45; i++) { const mid = (lo + hi) / 2;
    if (cdf(mid) < p) lo = mid; else hi = mid; }
  return (lo + hi) / 2;
};
console.log({ mean: a / (a + b), lower: quantile(.025), upper: quantile(.975) });
```

实际运行得到 `{ mean: 0.59375, lower: 0.4219, upper: 0.7545 }`（四舍五入）。数值会随先验和数据改变；不要把这个区间复制到自己的研究报告。

## 先验怎么写，怎样知道它在“帮倒忙”？

先验不是“越无信息越好”。例如比例参数可用 Beta 分布，回归系数可用以 0 为中心、尺度反映实际可见差异的正态分布。先把先验转换成可读问题：“在看数据前，我认为 95% 的合理斜率范围是什么？”若答案明显不合理，先修正量表、单位或先验。

至少做三组敏感性分析：合理的窄先验、弱信息先验和更宽先验。比较后验均值、区间和关键决策概率；若结论只在一种先验下成立，应如实报告，而不是挑选最顺眼的一组。

## 从后验到研究结论

- **参数估计：** 报告后验均值或中位数、95% 可信区间，以及 $P(\theta>0\mid y)$ 或 $P(|\theta|<\delta\mid y)$ 等与研究问题对应的概率。
- **实际等价区间（ROPE）：** 先定义“对实践足够小”的 $[-\delta,\delta]$，再报告后验落入该区间的概率；不要用 0.05 机械替代实际意义。
- **预测：** 用后验预测分布检查新参与者/新试次的合理范围，并比较观测数据与模拟数据的分布、极值和缺失模式。
- **模型比较：** WAIC/LOO 关注预测表现；贝叶斯因子比较的是两个明确模型的边际似然，强烈依赖先验，不能把 BF 当作“显著性 p 值的贝叶斯版本”。

在本例中，若比较 $H_0:p=.5$ 与 $H_1:p\sim\text{Beta}(1,1)$，对“18/30”这一计数的贝叶斯因子 $BF_{10}\approx0.40$（偏向 $H_0$，约为 $BF_{01}=2.50$）。这不是矛盾，而是提醒你：漫无边界的 $H_1$ 也会因先验预测分散而受到惩罚；模型和先验必须在分析前写清。

## MCMC 模型的操作与排错

共轭模型可直接算，真实心理学模型常需 MCMC（如 Stan、PyMC、brms）：

1. **准备：** 明确变量类型、层级、缺失机制和标准化；先用模拟数据验证代码能否恢复已知参数。
2. **拟合：** 固定随机种子、链数、迭代数、warm-up 和软件版本；保存原始采样日志。
3. **收敛：** 查看 $\hat R$（通常希望接近 1）、有效样本量、trace plot 和 divergent transitions。不要只看“程序跑完”。
4. **预测检查：** 从后验生成复制数据，比较均值、方差、比例、相关和极端值；不匹配时回到似然或层级结构。
5. **报告：** 给出先验、似然、采样设置、诊断、敏感性分析和完整代码/数据版本。

常见报错的方向：发散转换通常提示参数化或先验尺度问题；$\hat R$ 偏高可能是混合差或模型未识别；有效样本量很低时增加迭代只是缓解，不会修复错误的模型。遇到复杂随机斜率、缺失非随机或强相关先验，应尽早请教统计顾问。

::: warning 解释边界
“后验概率高”仍是条件陈述；它依赖数据、似然、先验和模型。观察性数据的后验关联不能自动变成因果效应，层级模型也不能凭空消除混杂。
:::

## 资源与工具

<ResourceGrid :min="200">
  <ResourceCard name="Stan User's Guide" desc="概率模型、先验与 MCMC 诊断" href="https://mc-stan.org/docs/stan-users-guide/" icon="📘" />
  <ResourceCard name="PyMC 文档" desc="Python 概率编程与后验预测" href="https://www.pymc.io/projects/docs/en/stable/learn.html" icon="🐍" />
  <ResourceCard name="brms 文档" desc="用 R 公式调用 Stan" href="https://paulbuerkner.com/brms/" icon="🧪" />
</ResourceGrid>

## 延伸阅读

- McElreath, R. (2020). *Statistical Rethinking* (2nd ed.). CRC Press.（章节与版本请按图书馆记录核对。）
- Kruschke, J. K. (2014). *Doing Bayesian Data Analysis* (2nd ed.). Academic Press.
- Gelman, A., et al. (2013). *Bayesian Data Analysis* (3rd ed.). CRC Press.
- Vehtari, A., Gelman, A., & Gabry, J. (2017). Practical Bayesian model evaluation using leave-one-out cross-validation and WAIC. *Statistics and Computing, 27*, 1413–1432. https://doi.org/10.1007/s11222-016-9696-4
