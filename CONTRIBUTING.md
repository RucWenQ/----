# 贡献与维护规范

## 一、如何添加 / 修改一节内容

### 修改已有小节

直接编辑对应的 `.md` 文件。例如 1.1 文献检索 → `docs/1-tools/literature-search.md`。

### 新增小节

1. 在对应章节文件夹下新建 `.md` 文件，文件名用 **kebab-case**（小写英文 + 短横线），例如 `effect-size.md`。
2. 文件顶部必须有 frontmatter：
   ```yaml
   ---
   title: 3.0.3 效应量
   description: 一句话描述本节内容
   ---
   ```
3. 在 `docs/.vitepress/sidebar.mts` 对应章节里增加一行：
   ```ts
   { text: '3.0.3 效应量', link: '/3-statistics/effect-size' }
   ```
4. 保存后 `npm run dev` 自动热更新。

### 新增整章

1. 在 `docs/` 下新建 `8-xxx/` 文件夹（数字前缀连续）。
2. 必须包含 `index.md`（章节首页）。
3. 在 `sidebar.mts` 里增加 `'/8-xxx/': [...]` 配置块。
4. 在 `config.mts` 的 `nav` 里增加导航项。

## 二、命名规范

| 类型         | 规则                                  | 示例                                            |
| ------------ | ------------------------------------- | ----------------------------------------------- |
| 章节文件夹   | `数字-英文短名/`                      | `3-statistics/`                                 |
| 小节 md 文件 | `kebab-case.md`                       | `mediation-moderation.md`                       |
| 图片文件     | `kebab-case.{png,svg,jpg}`            | `power-curve.png`                               |
| 资源文件夹   | `docs/public/images/chapters/{章节}/` | `images/chapters/3-statistics/`                 |
| 引用图片路径 | 绝对路径，不带 `public/`              | `/images/chapters/3-statistics/power-curve.png` |
| 内部链接     | 不带 `.md`，相对当前路径              | `[功效分析](./sampling-power)`                  |

## 三、写作规范

### Frontmatter 必填字段

```yaml
---
title: 章节号 + 中文标题 # 例：3.0 基础概念
description: 一句话描述
---
```

### 推荐结构（小节级别）

```markdown
# 章节号 标题

::: tip 本节目标
读完本节读者能做什么。
:::

## 大块 1

正文...

## 大块 2

正文...

## 资源与工具

<ResourceGrid>...</ResourceGrid>

## 延伸阅读

- 链接 / 文献
```

### 强调与样式

- **重要术语**：第一次出现用粗体 `**term**`
- **关键词高亮**：用 `<span class="kw">关键词</span>`（黄色背景）
- **行内代码**：`` `code` ``
- **数学公式**：`$d = (\bar{X}_1 - \bar{X}_2) / s$` 或 `$$...$$`

### 图片

引用方式：

```markdown
![功效曲线](/images/chapters/3-statistics/power-curve.png)
```

文件放在：`docs/public/images/chapters/3-statistics/power-curve.png`

## 四、组件速查

详见 [vibe coding 提示词](./PROMPT.md) 第 4 节。
