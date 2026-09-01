---
title: A.2 常用术语对照
description: 中英术语 + 简明定义
---

# A.2 常用术语对照

::: tip 本节目标
遇到英文术语、缩写或审稿意见时，你能先用一句话判断它在研究流程中的作用，再跳回对应正文页做决定。表格是检索入口，不是脱离问题的“定义背诵”；同一个词在不同模型中可能有更窄的技术含义。
:::

## 怎样使用这张表？

先找到你正在做的动作（提问、测量、分析、报告或开放），再看“下一步”一列。若术语涉及因果、测量不变性、缺失机制、复杂依赖结构或模型诊断，不要只凭一句定义作结论，打开链接并保留原始输出。

贯穿示例仍是“手机通知静音是否改变本科生短时学习正确率”。例如，**estimand** 先固定你要估计的比较，**observation unit** 再说明每一行数据代表试次还是被试；两者都没写清时，任何 *p* 值都无法解释。

## 1. 从问题到设计：我到底在估计什么？

| 中文 | English | 一句话说明 | 下一步 / 易混淆 |
| --- | --- | --- | --- |
| 构念 | construct | 理论中的目标属性，如“注意力切换负担”，不能直接从一个题目读出。 | 写出边界和指标；不要与单个 **measure**（测量工具）混为一谈。 |
| 操作化 | operationalization | 把构念转成可执行的操纵、题目、行为指标和计分规则。 | 在 [2.2 测量](../2-design/measurement) 留版本与授权记录。 |
| 估计目标 | estimand | 预先规定“对谁、在什么处理/时间下、以什么量尺比较”的目标量。 | 与 **estimator**（用数据计算它的规则）区分。 |
| 观测单位 | observation unit | 一行资料代表的实体，如一个人、一次试次或一个二元组。 | 先画数据字典；不要把观测数自动当成独立样本量。 |
| 独立单位 | independent unit | 在抽样或随机化后可视为相互独立的最小单位；重复试次通常不是它。 | 与 [3.6 多层模型](../3-statistics/multilevel) 的嵌套层级核对。 |
| 随机化单位 | randomization unit | 实际被随机分配处理的实体，可能是个人、班级或地点。 | 与独立单位不一致时，按聚类设计规划功效。 |
| 混杂 | confounding | 一个同时影响处理/暴露和结果的变量，使比较不再只反映目标路径。 | 画因果图并在 [2.3 实验设计](../2-design/experimental-design) 记录控制理由；不要把中介当混杂调整。 |
| 干扰 | interference | 一个单位的处理改变另一个单位的结果，例如同班学生互相看到通知设置。 | 明确 SUTVA/网络边界；必要时改随机化或分析单位。 |

## 2. 测量与资料质量：这个数字可信到什么程度？

| 中文 | English | 一句话说明 | 下一步 / 易混淆 |
| --- | --- | --- | --- |
| 信度 | reliability | 在指定条件下测量结果的稳定性或一致性；高信度不等于测到了目标构念。 | 报告估计方法与不确定性；不要把 α 阈值当作效度证据。 |
| 效度 | validity | 分数能否支持你对构念或结果的具体解释，是证据链而非一次“通过”。 | 分开内容、结构、与外部变量关系和后果证据。 |
| 测量不变性 | measurement invariance | 不同组/时间的分数是否具有可比的测量关系。 | 先检验可比性再比较潜变量均值；见 [2.2 测量](../2-design/measurement)。 |
| 操纵检查 | manipulation check | 检查参与者是否经历了预定操纵的辅助指标。 | 它不是主要结果，也不能单独证明因果机制。 |
| 缺失机制 | missingness mechanism | 缺失与已观测/未观测资料的关系（常用 MCAR、MAR、MNAR 作为模型假设标签）。 | 记录缺失原因和模式，做敏感性分析；不要把删除缺失当默认无害。 |
| 选择偏差 | selection bias | 进入样本、完成测量或留在分析中的机会与研究变量有关，导致目标人群不再可代表。 | 比较纳入与退出流程；增加样本量不能自动修复。 |
| 最小关注效应 | smallest effect of interest (SESOI) | 研究者认为在理论或实践上值得区分的最小差异。 | 在功效/精度和区间解释中预先写出，不要用事后显著性代替。 |
| 预试 | pilot / feasibility study | 先检查流程、招募、测量和程序是否可行的研究，不自动提供确认性效应证据。 | 标明目的和停止规则；不要把预试估计当正式样本量效果。 |

## 3. 推断与效应：结果应该怎样读？

| 中文 | English | 一句话说明 | 下一步 / 易混淆 |
| --- | --- | --- | --- |
| 参数 | parameter | 总体或模型中定义的目标量，如总体平均处理效应或回归斜率。 | 报告估计值和区间；不要把样本统计量写成总体事实。 |
| 估计量 / 估计值 | estimator / estimate | 估计量是计算规则，估计值是本次资料算出的数。 | 与 **estimand**（目标量）配对写，见 [3.0 基础概念](../3-statistics/foundations)。 |
| 标准误 | standard error (SE) | 估计量在重复抽样下的典型波动尺度，不是个体分数的标准差。 | 与置信区间和模型假设一起报告；不要把 SE 当测量信度。 |
| 置信区间 | confidence interval (CI) | 在重复抽样的覆盖率解释下构造的参数区间；不是“参数有某概率在此区间”。 | 写明置信水平、模型和区间方法；与 Bayesian **credible interval** 区分。 |
| *p* 值 | *p* value | 在零假设及模型条件下，观察到同样或更极端数据的尾部概率。 | 不能表示零假设为真的概率，也不能表示效应大小。 |
| 效应量 | effect size | 把差异、关联或模型参数按原始或标准化量尺表达的大小。 | 同时给方向、量尺和不确定性；不要脱离情境套“小/中/大”标签。 |
| 实际重要性 | practical significance | 效应是否超过 SESOI、成本或决策阈值，而不只看统计显著。 | 在研究开始前写阈值来源，避免把“显著”改写成“有用”。 |
| 多重比较 | multiplicity / multiple comparisons | 同时检验多个结果、时间点或子组会改变至少一次误报的机会。 | 预先列主要对比，说明控制或探索性策略；见 [3.1 描述性统计](../3-statistics/descriptive)。 |
| 敏感性分析 | sensitivity analysis | 在合理的替代假设、模型或缺失处理下重算，检查结论是否依赖一个选择。 | 报告改变了什么和没改变什么；不是挑选“最好看”的结果。 |

## 4. 模型与结构：为什么不能只换一个按钮？

| 中文 | English | 一句话说明 | 下一步 / 易混淆 |
| --- | --- | --- | --- |
| 重复测量 | repeated measures | 同一单位在多个时间/条件被观测，行与行相关。 | 用配对、重复测量或混合模型；不要把行数当独立 *N*。 |
| 嵌套数据 | nested / clustered data | 低层观测属于更高层群组，如试次—被试、学生—班级。 | 识别聚类和随机化层级，检查 ICC/设计效应。 |
| 固定效应 | fixed effect | 对一组已定义水平或总体平均关系进行估计的模型项。 | 解释系数对应的对比和参考组；不要把“固定”理解成无不确定性。 |
| 随机效应 | random effect | 描述群组间截距/斜率变异的模型部分，通常需要明确其分布假设。 | 查看收敛和奇异拟合；与“随机分配”不是同一个词。 |
| 交互 / 调节 | interaction / moderation | 一个变量的效应随另一个变量水平而改变。 | 画条件效应和区间，避免只读交互 *p*；见 [3.5 中介与调节](../3-statistics/mediation-moderation)。 |
| 中介 | mediation | 用中间变量描述处理/暴露与结果之间的一条统计路径。 | 需要时间顺序和识别假设才能作机制解释；显著间接效应不自动证明机制。 |
| 异质性 | heterogeneity | 不同研究、群组或单位的真实效应存在差异。 | 在元分析/多层模型中报告其估计和来源，不要把差异平均抹掉。 |

## 5. 贝叶斯与开放科学：如何让推断可追踪？

| 中文 | English | 一句话说明 | 下一步 / 易混淆 |
| --- | --- | --- | --- |
| 先验 | prior | 在看到当前资料前，对参数可能值的概率描述。 | 说明来源并做先验敏感性；不是“主观所以不科学”。 |
| 似然 | likelihood | 在给定参数下，资料出现的相对支持程度。 | 与先验结合得到后验；不要把似然当参数的概率。 |
| 后验 | posterior | 结合先验与资料后对参数的更新分布。 | 报告区间、预测检验和诊断；见 [3.9 贝叶斯](../3-statistics/bayesian)。 |
| 可信区间 | credible interval | 后验分布中包含指定概率质量的参数区间。 | 解释依赖模型与先验；不要与频率学派 CI 互换说法。 |
| 预注册 | preregistration | 在看结果前公开研究问题、设计、主要结果和分析计划的时间戳记录。 | 偏离要列理由；预注册不是保证研究正确。 |
| 注册报告 | Registered Report | 先评审问题和方法，原则性接收后再收集/分析数据的出版流程。 | 与普通预注册和事后开放数据区分；查期刊当前政策。 |
| 确认性 / 探索性 | confirmatory / exploratory | 前者检验预先指定的问题，后者生成待复制的假设；两者都可有价值。 | 在方案、脚本和论文中分开标记，不用标签掩盖灵活分析。 |
| 可复现性 | reproducibility | 另一位研究者能用同一材料、代码和版本得到相同或可解释的结果。 | 保存数据字典、环境锁定和运行日志；与 **replicability**（新资料重做）区分。 |
| 去标识化 | de-identification | 移除或转换直接/间接识别线索以降低重新识别风险。 | 做风险评估、访问控制和数据使用协议；不等于绝对匿名。 |

## 术语不确定时的三步排错

1. **回到句子。** 把术语所在的整句、模型和数据结构抄入日志；单独翻译一个词很容易丢掉限定条件。
2. **核对权威口径。** 先查对应正文页、APA Dictionary 或报告规范；记录版本、章节和访问日期。
3. **写出决定与边界。** 在分析备忘录中说明你采用的含义、不能据此推出什么，以及需要导师/统计顾问确认的地方。

## 资源与工具

<ResourceGrid :min="200">
  <ResourceCard
    name="APA Dictionary of Psychology"
    desc="英文心理学术语的定义和词义范围"
    href="https://dictionary.apa.org/"
    icon="📖"
  />
  <ResourceCard
    name="APA JARS"
    desc="样本、测量、分析和报告术语的检查入口"
    href="https://apastyle.apa.org/jars"
    icon="📋"
  />
  <ResourceCard
    name="PRISMA 2020"
    desc="综述流程、纳入和报告术语"
    href="https://www.prisma-statement.org/"
    icon="🧭"
  />
  <ResourceCard
    name="CONSORT-SPIRIT"
    desc="随机试验与方案报告的术语和清单"
    href="https://www.consort-spirit.org/"
    icon="🔬"
  />
</ResourceGrid>

## 延伸阅读

- Shadish, W. R., Cook, T. D., & Campbell, D. T. (2002). *Experimental and quasi-experimental designs for generalized causal inference*. Houghton Mifflin.（因果、混杂、干扰与外推边界。）
- Wilkinson, L., & APA Task Force on Statistical Inference. (1999). Statistical methods in psychology journals: Guidelines and explanations. *American Psychologist, 54*(8), 594–604. https://doi.org/10.1037/0003-066X.54.8.594（估计、不确定性与报告。）
- Appelbaum, M., et al. (2018). Journal article reporting standards for quantitative research in psychology. *American Psychologist, 73*(1), 3–25. https://doi.org/10.1037/amp0000191（定量研究报告字段。）
- Page, M. J., et al. (2021). The PRISMA 2020 statement. *BMJ, 372*, n71. https://doi.org/10.1136/bmj.n71（综述流程与透明报告。）
- Vehtari, A., Gelman, A., & Gabry, J. (2017). Practical Bayesian model evaluation using leave-one-out cross-validation and WAIC. *Statistics and Computing, 27*, 1413–1432. https://doi.org/10.1007/s11222-016-9696-4（贝叶斯模型评估与诊断。）
