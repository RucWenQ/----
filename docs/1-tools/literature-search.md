---
title: 1.1 文献检索
description: 去哪读、什么是好文献、怎么检索
---

# 1.1 文献检索与管理

::: tip 本节目标
读完后你能：(1) 找到本领域的可靠文献来源；(2) 用 IF / JCI / 分区粗筛文献质量；(3) 用主题词 + filter 在 Web of Science 检索得到精准结果。
:::

## 1.1.1 去哪里读文献

主要的文献入口：

<ResourceGrid :min="200">
  <ResourceCard
    name="Web of Science"
    desc="综合检索 · 引文分析"
    href="https://libdb.zju.edu.cn/s/lib/libtb/show/405"
    icon="🔍"
  />
  <ResourceCard
    name="APA PsycInfo"
    desc="心理学专属库"
    href="https://libdb.zju.edu.cn/s/lib/libtb/turning/1334"
    icon="🧠"
  />
  <ResourceCard
    name="浙大数据库导航"
    desc="所有可用资源入口"
    href="https://libweb.zju.edu.cn"
    icon="📚"
  />
  <ResourceCard
    name="Google Scholar"
    desc="补充检索 · 设置 alerts"
    href="https://scholar.google.com"
    icon="🎓"
  />
</ResourceGrid>

::: warning 校外访问
浙大数据库需要校园网或 VPN。如果你在校外，先看 [1.7 网络与 VPN](./vpn)。
:::

## 1.1.2 什么是「好文献」

"好期刊上发的*通常*是好文献"——但这只是先验，不是判据。下表给你一个粗筛工具：

| 指标 | 怎么看 | 及格线 |
| --- | --- | --- |
| **IF** (Impact Factor) | 每篇文章平均被引 | 外文 > 3 |
| **JCI** | 领域内相对位置（= 1 即平均） | > 1 |
| **JCR 分区** | Q1 / Q2 / Q3 / Q4 | Q1–Q2 优先 |
| **中科院分区** | 1–4 区 | 1–2 区优先 |

::: warning 慎用
分区不是真理。同一篇文章可能在 Q1 期刊上是水文，在 Q3 期刊上是开创性工作。**看作者、看引用网络、看是否被领域综述提及**，比看分区更重要。
:::

### 社心方向常读期刊

以下按研究领域分类，列出社会心理学研究生需要熟悉的核心期刊。
每本期刊标注**全称**（不缩略）、官网链接和 1–2 句定位说明。

#### 社会心理学顶刊

- **[Journal of Personality and Social Psychology](https://www.apa.org/pubs/journals/psp)**（JPSP）—— 社会心理学旗舰期刊，APA 出版。分三个独立板块：态度与社会认知、人际与群际过程、人格过程与个体差异。发表最严格的理论驱动型实证研究。
- **[Personality and Social Psychology Bulletin](https://journals.sagepub.com/home/psp)**（PSPB）—— 社会心理学会（SPSP）旗舰刊物。以短篇高影响力实证报告著称，对方法严谨性和可复制性要求高。
- **[Journal of Experimental Social Psychology](https://www.sciencedirect.com/journal/journal-of-experimental-social-psychology)**（JESP）—— 欧洲社会心理学会旗下期刊。偏好实验法研究，审稿速度快，对理论贡献和实验设计有较高要求。
- **[Personality and Social Psychology Review](https://journals.sagepub.com/home/psr)**（PSPR）—— 社会/人格心理学领域影响因子最高的综述期刊。只发理论综述与元分析，不接收实证报告。是构建理论框架的必读来源。
- **[British Journal of Social Psychology](https://bpspsychub.onlinelibrary.wiley.com/journal/20448309)**（BJSP）—— 英国心理学会社会心理学分会会刊。重视社会认知、群体过程和定性研究方法。

#### 综合 / 通用方向

- **[Proceedings of the National Academy of Sciences](https://www.pnas.org/)**（PNAS）—— 美国国家科学院院刊，多学科顶刊。社会心理学领域常在此发表跨学科、高影响力的行为科学研究。
- **[Nature Human Behaviour](https://www.nature.com/nathumbehav/)** —— Nature 子刊，2017 年创刊。发表行为科学各领域高影响力研究，对社会心理学、认知心理学和公共政策研究尤为关注。
- **[Psychological Science](https://journals.sagepub.com/home/pss)**（PS）—— APS 旗舰期刊，心理学综合顶刊。偏好短文、新范式、大样本和多方法研究，是心理学最受关注的综合性期刊之一。
- **[Journal of Experimental Psychology: General](https://www.apa.org/pubs/journals/xge)**（JEP:G）—— APA 出版的综合性实验心理学期刊。对社会心理学、认知心理学和跨学科研究均持开放态度，重视理论和方法的创新性。
- **[Science Advances](https://www.science.org/journal/sciadv)** —— Science 旗下开放获取子刊。近年发表不少社会心理学大样本复现和跨文化研究。

#### 综述类

- **[Annual Review of Psychology](https://www.annualreviews.org/journal/psych)** —— 心理学领域最权威的年度综述期刊。每篇文章由领域顶尖学者受邀撰写，系统回顾子领域的发展脉络与前沿。适合入门新领域时作为第一站。
- **[Nature Reviews Psychology](https://www.nature.com/nrpsychol/)** —— Nature Reviews 系列心理学子刊，2022 年创刊。发表权威综述与视角文章，覆盖心理学全领域。
- **[Psychological Bulletin](https://www.apa.org/pubs/journals/bul)** —— APA 出版的心理学综述顶刊。以元分析综述和方法学综述见长，对社会心理学理论整合与争议问题有重要影响。
- **[Perspectives on Psychological Science](https://journals.sagepub.com/home/pps)** —— APS 出版。发表观点文章、方法反思、理论整合和元科学讨论，是理解学科发展方向和争议的重要窗口。

#### 人机交互与网络心理学

- **[Computers in Human Behavior](https://www.sciencedirect.com/journal/computers-in-human-behavior)**（CHB）—— 人机交互与心理学的交叉期刊。接收社会网络、社交媒体行为、在线互动、游戏行为等主题的实证研究。近年来影响因子持续上升，是 cyberpsychology 方向的重要发表渠道。
- **[Cyberpsychology, Behavior, and Social Networking](https://home.liebertpub.com/publications/cyberpsychology-behavior-and-social-networking/10)** —— 网络心理学与社交媒体研究的核心期刊。涵盖虚拟现实、在线身份、网络成瘾、数字健康等主题。

#### 组织管理 / 商学交叉

- **[Journal of Applied Psychology](https://www.apa.org/pubs/journals/apl)**（JAP）—— APA 出版的应用心理学顶刊。发表组织行为、人事心理学、领导力、工作动机等方向的实证研究。社会心理学与组织心理学的关键交叉出口。
- **[Organizational Behavior and Human Decision Processes](https://www.sciencedirect.com/journal/organizational-behavior-and-human-decision-processes)**（OBHDP）—— 组织行为与决策心理学领域核心期刊。关注判断与决策、谈判、道德行为、社会认知在组织情境中的应用。
- **[Journal of Consumer Research](https://academic.oup.com/jcr)**（JCR）—— 消费者行为研究顶刊。发表消费心理、判断与决策、品牌态度等方向的实证与理论文章，与社会心理学高度交叉。
- **[Journal of Marketing](https://journals.sagepub.com/home/jmx)**（JM）—— 美国市场营销协会旗舰期刊。发表高影响力的营销与消费行为研究。
- **[Psychology & Marketing](https://onlinelibrary.wiley.com/journal/15206793)** —— 心理与营销交叉期刊。对消费者心理、广告效果、品牌认知等社会心理学应用主题较友好。

#### 中文期刊

- **[心理学报](https://journal.psych.ac.cn/)** —— 中国心理学会主办的心理学综合性权威期刊。发表高质量实证研究与理论文章，是中文心理学领域的旗舰刊物。
- **[心理科学](https://www.psysci.org/)** —— 中国心理学会主办，综合性较强，覆盖范围广，对社会心理学、发展心理学、教育心理学均有覆盖。
- **[心理科学进展](https://journal.psych.ac.cn/xlkxjz/)** —— 中国科学院心理研究所主办，以综述性和前沿进展文章为主。适合入门新领域和快速了解中文文献动态。

::: danger 不建议作为主要参考
大部分中文期刊（除上述三本）；学位论文；Frontiers in \*（Frontiers in Psychology 等）；PLoS One；Scientific Reports。这不是说它们一定不好——里面不乏优秀论文。但作为新手的"权重锚"，这些来源的文章质量方差极大，会扭曲你对领域标准的直觉。等你有了足够的辨别力，再回头翻阅也不迟。
:::

## 1.1.3 怎么检索

以 Web of Science 为例，一个高效检索包含四步：

1. **关键词检索**：在 topic 框输入主题词（topic = 标题 + 摘要 + 关键词）。
2. **排序**：默认是相关性 (relevance)。当主题词相对丰富、精准时，可以改成被引量 (citation: highest first) 或日期 (date: newest first)。
3. **过滤** (filters)：
   - 选中 review articles 并选择 **exclude** → 不看综述
   - 选中并 **refine** → 只看综述
   - 也可以筛选年份、期刊名、**研究领域（推荐）**
4. **高级检索** (advanced search)：例如 `TS=(self-control) AND SO=(JPSP)`。

### 一个示范流程

::: details 示范：找"道德判断"近三年的高被引论文
1. Topic 输入：`moral judgment`
2. 时间筛选：`Last 3 Years`
3. 研究领域筛选：`Psychology, Social` 或 `Psychology, Multidisciplinary`
4. 排序：`Citations: highest first`
5. 在前 30 篇里挑 5–10 篇精读
:::

## 1.1.4 其他文献工具

<ResourceGrid :min="180">
  <ResourceCard
    name="Research Rabbit"
    desc="可视化文献网络"
    href="https://www.researchrabbit.ai/"
    icon="🐇"
  />
  <ResourceCard
    name="Connected Papers"
    desc="单篇论文的引用图谱"
    href="https://www.connectedpapers.com/"
    icon="🕸️"
  />
  <ResourceCard
    name="ResearchGate"
    desc="作者主页 · 求 PDF"
    href="https://www.researchgate.net/"
    icon="🔬"
  />
  <ResourceCard
    name="文献鸟 Stork"
    desc="新文章订阅推送"
    href="https://www.storkapp.me/"
    icon="🐦"
  />
</ResourceGrid>

## 下一步

文献找到了，需要管理起来 → [1.2 Zotero 全工作流](./zotero)
