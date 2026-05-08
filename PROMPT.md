# Vibe Coding 系统提示词

> 把这份文件的内容粘到你后续每次让 AI（Claude / GPT / Cursor / Copilot）协助更新本网站时的对话开头，作为"系统说明"。AI 拿到这份说明后，就知道项目是什么、怎么改、改在哪里。

---

## 一、项目背景

我正在维护一个名为 **「简明教程」** 的网站。它是给社会心理学方向研究生师弟师妹的科研入门工具书，覆盖从科研工具、研究设计、统计、作图、研究方法、选题到论文写作的完整工作流。

它有两种使用场景：

1. **教案**：我会基于内容做线下 lecture / 线上直播的讲义；
2. **工具书**：师弟师妹遇到具体卡点时上来检索查阅。

因此内容上要求：**可读、可查、可执行**——读者能读懂概念，能在目录里找到入口，并且能按步骤上手。

## 二、技术栈

- **VitePress 1.x** 构建静态站，源文件 Markdown，部署 GitHub Pages / Vercel / Netlify 任一。
- **Vue 3** 自定义组件，通过 `docs/.vitepress/theme/components/` 注册。
- **MathJax 3** 数学公式渲染（在 `config.mts` 已启用）。
- **本地搜索**（不接 Algolia）。

## 三、目录结构（必须遵守）

```
zju-psyc-tutorial/
├── docs/
│   ├── .vitepress/
│   │   ├── config.mts          ← 全局配置（导航、搜索、品牌信息）
│   │   ├── sidebar.mts         ← 侧边栏（新增小节后必须更新这里）
│   │   └── theme/
│   │       ├── index.ts        ← 主题入口（注册自定义组件）
│   │       ├── style.css       ← 全局样式（米黄+朱砂红学术风）
│   │       └── components/     ← 自定义 Vue 组件
│   ├── public/
│   │   ├── images/chapters/{章节}/   ← 图片按章节归档
│   │   ├── files/              ← 可下载的 PDF / 资料
│   │   └── code/               ← 可下载的示例代码
│   ├── index.md                ← 首页
│   ├── 0-introduction/         ← 第 0 章（引言）
│   ├── 1-tools/                ← 第 1 章（科研工具）
│   ├── 2-design/               ← 第 2 章（研究设计）
│   ├── 3-statistics/           ← 第 3 章（统计）
│   ├── 4-visualization/        ← 第 4 章（科研作图）
│   ├── 5-methods/              ← 第 5 章（研究方法）
│   ├── 6-topic/                ← 第 6 章（选题）
│   ├── 7-writing/              ← 第 7 章（论文写作）
│   └── appendix/               ← 附录
├── package.json
├── README.md
├── CONTRIBUTING.md
└── PROMPT.md                   ← 本文件
```

## 四、各章节内容范围

| 章节       | 路径               | 主题                                                                  |
| ---------- | ------------------ | --------------------------------------------------------------------- |
| 0 引言     | `0-introduction/`  | 给谁看 / 学习路径 / 全流程地图 / 复现危机                             |
| 1 科研工具 | `1-tools/`         | 文献检索、Zotero、统计软件、AI 辅助、实验程序、协作工具、VPN          |
| 2 研究设计 | `2-design/`        | 假设、测量、实验设计、功效分析、预注册、伦理                          |
| 3 统计     | `3-statistics/`    | 基础概念、描述、差异、卡方、回归、中介调节、多层、SEM、元分析、贝叶斯 |
| 4 科研作图 | `4-visualization/` | 图的语法、常用图谱、ggplot2、seaborn、投稿级细节                      |
| 5 研究方法 | `5-methods/`       | vignette、实验室 / 现场实验、量表、纵向 / 日记、二元、质性            |
| 6 选题     | `6-topic/`         | 灵感来源、评估、操作化                                                |
| 7 写作     | `7-writing/`       | 文献综述、IMRD、投稿、审稿回复、格式细节                              |
| 附录       | `appendix/`        | 书单、术语对照、致谢                                                  |

完整目录见 `docs/.vitepress/sidebar.mts`。

## 五、命名规范

| 类型             | 规则                                          | 示例                                            |
| ---------------- | --------------------------------------------- | ----------------------------------------------- |
| 章节文件夹       | `数字-英文短名/`                              | `3-statistics/`                                 |
| 小节 md 文件     | `kebab-case.md`（小写英文 + 短横线）          | `mediation-moderation.md`                       |
| 图片文件         | `kebab-case.{png,svg,jpg}`                    | `power-curve.png`                               |
| 图片放置位置     | `docs/public/images/chapters/{章节文件夹名}/` | `images/chapters/3-statistics/`                 |
| 图片在 md 中引用 | 绝对路径（不带 `public/`）                    | `/images/chapters/3-statistics/power-curve.png` |
| 内部链接         | 站内绝对路径，不带 `.md` 后缀                 | `[功效分析](/2-design/sampling-power)`          |
| 同章内链接       | 可用相对路径                                  | `[功效分析](./sampling-power)`                  |

## 六、Markdown 规范（每个 .md 必须遵守）

### Frontmatter

每个 `.md` 文件**第一行起**必须有：

```yaml
---
title: 章节号 + 中文标题（例：3.0.3 效应量）
description: 一句话描述本节内容
---
```

### 推荐的小节结构

```markdown
# 章节号 中文标题

::: tip 本节目标
读完后读者能做什么（具体、可验证）。
:::

## 概述

2–3 段引入。

## 主要内容（拆成多个 ## 二级标题）

### 子主题（## 之下用 ###）

正文...

## 资源与工具

<ResourceGrid>...</ResourceGrid>

## 延伸阅读

- 链接 / 文献
```

### 文风

- **简洁、可执行、不冗余**。每节读完读者要能立刻动手。
- **直白，不绕圈**。避免"在某种意义上""一定程度上"这类无信息含量的词。
- **关键词第一次出现用粗体**：`**预注册**`。
- **关键句用黄色高亮**：`<span class="kw">区分"事先假设"与"事后讲故事"</span>`。
- **避免堆砌符号 emoji**。如果一节里要用，用作章节锚点（如 🌱 ⚙️ 📑）即可。

## 七、可用组件（直接在 .md 里写）

### 1. VitePress 内置 Callout 容器

```markdown
::: tip 本节目标
绿色提示框。用于"目标 / 经验法则 / 实操建议"。
:::

::: warning 慎用
橙色警告框。用于"常见误用 / 需要小心"。
:::

::: danger 不建议
红色危险框。用于"不要这样做 / 严重错误"。
:::

::: info 待补充
蓝色信息框。用于"待办 / 元信息"。
:::

::: details 点击展开
默认折叠的内容。用于示范流程、长代码、可选的细节。
:::
```

### 2. ResourceCard / ResourceGrid（资源链接卡片）

```vue
<ResourceGrid :min="200">
  <ResourceCard
    name="Web of Science"
    desc="综合检索 · 引文分析"
    href="https://example.com"
    icon="🔍"
  />
  <ResourceCard
    name="另一个工具"
    desc="一句话功能描述"
    href="https://example.com"
    icon="📚"
  />
</ResourceGrid>
```

参数：`name`（必填，工具名）、`desc`（描述）、`href`（必填，外链）、`icon`（emoji 图标）。
`<ResourceGrid>` 接 `:min="200"` 控制卡片最小宽度，或 `:cols="3"` 强制列数。

### 3. OutlineCard（章节路线图）

```vue
<OutlineCard title="本节路线图">

- 第一步内容
- 第二步内容
- 第三步内容

</OutlineCard>
```

⚠️ **重要**：`<OutlineCard>` 标签内部要写 Markdown 时，**前后必须空一行**，否则不会渲染。

### 4. ChapterCover（章节封面）

仅用于章节首页 `index.md` 的开头。

```vue
<ChapterCover
  meta="CHAPTER 3 — STATISTICS"
  title="3 · 统计"
  quote="数据不会自己说话。问错了问题，它能讲出任何故事。"
/>
```

### 5. StarRating（星级）

```vue
推荐指数：
<StarRating :score="4" />
（4/5）
```

### 6. 数学公式

```markdown
行内：$d = (\bar{X}_1 - \bar{X}_2) / s_{\text{pooled}}$

块级：

$$
d = \frac{\bar{X}_1 - \bar{X}_2}{s_{\text{pooled}}}
$$
```

### 7. 代码块

````markdown
```r
library(pwr)
pwr.t.test(d = 0.4, power = 0.80)
```
````

支持的语言标识：`r`、`python`、`bash`、`yaml`、`json`、`javascript`、`typescript`、`vue`、`css`、`html`、`markdown` 等。

### 8. 多语言代码组（VitePress 内置）

```markdown
::: code-group

\`\`\`r [R]
library(pwr)
pwr.t.test(d = 0.4, power = 0.80)
\`\`\`

\`\`\`python [Python]
from statsmodels.stats.power import TTestIndPower
TTestIndPower().solve_power(effect_size=0.4, power=0.8, alpha=0.05)
\`\`\`

:::
```

## 八、典型任务模板

### 任务 A：填充某一节的具体内容

> "请帮我填充 `docs/3-statistics/foundations.md` 这一节的内容，主题是统计基础概念，应包括：(1) 数据与变量类型；(2) p 值的意义与误用；(3) 效应量；(4) 统计功效；(5) 置信区间。请遵守 PROMPT.md 中的规范，特别是 frontmatter、callout 容器、组件用法。**不要修改其他文件**。"

### 任务 B：新增一个未在 sidebar 里的小节

> "请新增一节 `3.4.1 哑变量与虚拟变量编码` 到统计章。要求：(1) 创建 `docs/3-statistics/dummy-coding.md`；(2) 在 `docs/.vitepress/sidebar.mts` 的 `/3-statistics/` 数组里 `3.4 回归分析` 后面插入对应条目；(3) 内容应包括 dummy / effect / Helmert 三种编码的差异和 R / SPSS 中的实现。"

### 任务 C：把一份外部资料整合进某一节

> "我把一份关于 Process 插件的笔记贴在下面，请整合进 `docs/3-statistics/mediation-moderation.md` 的「实操：用 SPSS Process 做中介」这一段。要求：(1) 保留原文里的截图引用，但把图片路径改成 `/images/chapters/3-statistics/`；(2) 用 OutlineCard 总结操作步骤；(3) 用 :::warning 标注容易踩坑的点。
>
> [此处粘贴笔记]"

### 任务 D：插入一张图

> "请在 `docs/2-design/sampling-power.md` 的「为什么需要功效分析」这一段后面插入一张配图。图片我已放在 `docs/public/images/chapters/2-design/why-power-matters.png`。caption 是「图 2.4：α=.05 时不同 d 与 N 的功效曲线」。"

### 任务 E：把别处资料压缩进资源卡

> "下面是一份我整理的『中介分析常用 R 包』清单，请把它转成 `docs/3-statistics/mediation-moderation.md` 中『工具速查』一节的 ResourceGrid。
>
> [此处粘贴清单]"

## 九、给 AI 的硬性约束

每次执行任务时，**不要**：

1. ❌ 修改 `docs/.vitepress/config.mts`（除非任务明确说要改导航 / 搜索 / 站点元信息）。
2. ❌ 修改 `docs/.vitepress/theme/style.css`（除非任务明确说要改样式）。
3. ❌ 修改 `docs/.vitepress/theme/components/` 下任何 .vue 文件（除非任务明确说要新增组件）。
4. ❌ 一次任务跨多章节大改。一次任务专注一节或一个明确的小目标。
5. ❌ 编造文献、数据、引用。如果原始资料没给，说明「待补充」并标注 `:::info 待补充`。
6. ❌ 在文档中加入未启用的组件名。

每次执行任务时，**应当**：

1. ✅ 输出后明确列出"修改了哪些文件、改了什么"。
2. ✅ 任何新增小节都要同步更新 `sidebar.mts`。
3. ✅ Frontmatter 字段完整。
4. ✅ 内部链接遵守路径规范（绝对路径不带 `.md`）。
5. ✅ 如果不确定某条事实（统计阈值、领域惯例、期刊规则），明确指出"此处需作者校对"，不强行编造。
6. ✅ 文风保持本教程已有的风格：直白、可执行、不绕圈。可参照 `docs/0-introduction/audience.md` 和 `docs/1-tools/literature-search.md` 这两份样板。

## 十、本地预览与发布

```bash
# 本地预览（边写边看）
npm run dev

# 构建静态站
npm run build

# 预览构建后的产物
npm run preview
```

部署：构建产物在 `docs/.vitepress/dist/`，整个目录扔到任意静态托管即可。

---

> **使用建议**：每次开始一个新对话让 AI 协助时，先把这份 `PROMPT.md` 整体粘进去，然后描述具体任务（参考第八节模板）。这能让 AI 在所有改动里保持一致的目录结构、命名、组件用法和文风。
