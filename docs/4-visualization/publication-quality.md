---
title: 4.5 投稿级图的细节
description: 从期刊要求到字体、配色、版式和可复核导出的验收流程
---

# 4.5 投稿级图的细节

::: tip 本节目标
读完后，你能把一张已经回答清楚研究问题的图，按目标期刊的当期要求设置尺寸、字体、颜色、坐标、图例和注释，导出 PDF/SVG/PNG，并用一张检查表发现裁切、字体、分辨率和可读性问题。投稿级不等于“装饰更多”，而是让数据、统计结果和文字在最终版面仍然清楚。
:::

## 先确认：什么才算“投稿级”？

投稿级是一个**交付条件**，不是跨期刊通用的模板。先打开目标期刊网站，记录图宽（单栏/双栏）、文件格式、色彩空间、字体嵌入、分辨率、图注位置和是否要求单独上传图文件；把核查日期和页面版本写进项目日志。不要根据记忆把“300 dpi”或某种字体当成所有期刊的规则。

图的内容仍由研究问题决定：原始分布、模型估计、区间和样本量要与分析一致。可回看[图的语法](./grammar)、[常用图谱](./common-charts)、[ggplot2](./ggplot2) 和 [seaborn](./seaborn)；本页只处理最后一公里的版式和验收。

## 一条最短交付路径

1. **冻结输入**：记录数据版本、分析脚本、软件/包版本和随机种子；确认图中每个数字来自同一份分析输出。
2. **读指南**：把目标尺寸、允许格式、字体和色彩要求复制到 `figure-spec.md`，并注明核查日期。
3. **先定尺寸再排版**：以最终印刷尺寸创建画布，避免最后缩放导致字号和线宽失衡。
4. **建立视觉层级**：标题/轴标签 > 刻度/图例 > 注释；删除不承载信息的装饰。
5. **固定语义**：同一项目中同一条件使用同一颜色、线型和标签；颜色之外再用形状或线型编码。
6. **导出两份**：按指南导出矢量文件和所需位图，保留源代码和原始导出文件，不只保存截图。
7. **独立验收**：在目标尺寸、黑白打印、灰度和色觉缺陷模拟下查看；让合作者只看图和图注复述研究问题。

## 尺寸、字体和线宽怎样一起设定？

尺寸决定同一字号在页面上的实际大小。先用毫米或英寸写入代码，再调字号和线宽；不要先在大画布上把字调到“看起来舒服”，最后任意缩小。

### Python：matplotlib/seaborn

```python
import matplotlib.pyplot as plt
import seaborn as sns

MM = 1 / 25.4
sns.set_theme(style="whitegrid", context="paper", font_scale=1.0)
fig, ax = plt.subplots(figsize=(170 * MM, 110 * MM))

# 在目标尺寸下设置，而不是依赖默认值
ax.tick_params(labelsize=8, width=0.6, length=3)
ax.set_xlabel("时间", fontsize=9, labelpad=4)
ax.set_ylabel("压力评分（0–100）", fontsize=9, labelpad=4)
ax.set_title("干预前后压力评分", fontsize=10, fontweight="bold", pad=8)
for spine in ax.spines.values():
    spine.set_linewidth(0.6)
```

`figsize`、`fontsize`、`linewidth` 和 `pad` 是互相影响的：字号太小会在单栏版面消失，线太粗会淹没点和区间。中文字体需先在目标系统安装并测试；不要在脚本中硬编码一个团队成员没有的字体。

### R：ggplot2

```r
library(ggplot2)

p <- ggplot(long_df, aes(time, stress, colour = condition)) +
  geom_point(position = position_jitterdodge(jitter.width = 0.06), alpha = .45) +
  theme_classic(base_size = 9) +
  theme(
    plot.title = element_text(size = 10, face = "bold", margin = margin(b = 6)),
    axis.title = element_text(size = 9),
    axis.text = element_text(size = 8, colour = "black"),
    legend.title = element_text(size = 8),
    legend.text = element_text(size = 8),
    panel.border = element_rect(fill = NA, colour = "black", linewidth = .5)
  )

ggsave("figures/stress-time.pdf", p, width = 170, height = 110,
       units = "mm", device = cairo_pdf)
```

`theme()` 只改版式；`scale_*()` 才改变刻度、标签或颜色映射。若只是放大可见范围，用 `coord_cartesian()`，不要用会丢弃观测的尺度 `limits` 来掩盖异常值。

## 配色怎样让含义可读而不是只“好看”？

- **分类条件**：使用有限、对比明确的离散颜色，并固定颜色到条件的映射；例如 control 永远是蓝色，intervention 永远是朱红色。
- **连续数值**：使用感知上较均匀的连续色阶；有正负方向时以 0 为中点的发散色阶，并在图例写出单位。
- **不确定性**：区间带可降低透明度，但不能用透明度代替区间定义；图注明确是标准误、95% 置信区间还是后验区间。
- **色觉和灰度**：颜色之外再用线型、形状或直接标注；用灰度打印检查相邻类别是否仍可区分。

```python
palette = {"control": "#2166AC", "intervention": "#B2182B"}
sns.lineplot(
    data=summary_df, x="time", y="estimate", hue="condition",
    style="condition", markers=True, dashes=False,
    palette=palette, hue_order=["control", "intervention"],
)
```

颜色代码、图例标签和排序应在脚本中显式写出。不要只靠默认调色板，也不要把 `p < .05` 的格子涂成醒目颜色来替代统计报告。

## 坐标轴、刻度和图例如何避免误导？

1. 连续量写单位和理论范围；比例、概率和量表分数的零点要有理由地处理。
2. 截断坐标会放大视觉差异。若确有版面需要，图注说明视窗，并同时给出完整范围或原始分布。
3. 刻度间隔应能读出主要比较；不要让几十个小刻度挤占图面。
4. 图例顺序与正文顺序一致。能直接标注的两条线不必再放一个很大的图例。
5. 轴标题、图例和注释使用读者熟悉的术语；缩写在图注第一次解释。

检查一个简单问题：遮住图注后，读者能否知道 x/y 分别是什么、颜色代表什么、区间是什么？如果不能，先修标签，再修颜色。

## 多面板和注释怎样保持一致？

多面板用于比较有明确关系的子问题。面板间尽量共享坐标和图例，并用 `(A) (B)` 或短标题标识；不要为了塞入更多结果而把字体缩到无法阅读。

```python
fig, axes = plt.subplots(1, 2, figsize=(170 * MM, 75 * MM), sharey=True)
for ax, condition in zip(axes, ["control", "intervention"]):
    panel = long_df[long_df["condition"] == condition]
    sns.stripplot(data=panel, x="time", y="stress", color="#4C4C4C",
                  jitter=0.08, size=3, ax=ax)
    ax.set_title(condition, fontsize=9, fontweight="bold")
    ax.set_xlabel("")
    ax.set_ylim(0, 100)
axes[0].set_ylabel("压力评分（0–100）")
axes[1].set_ylabel("")
fig.text(0.02, 0.98, "(A)", ha="left", va="top", fontsize=9, fontweight="bold")
fig.text(0.51, 0.98, "(B)", ha="left", va="top", fontsize=9, fontweight="bold")
fig.subplots_adjust(wspace=0.12, top=0.86, bottom=0.18, left=0.12, right=0.98)
```

注释只标记预先计划的比较、阈值或数据处理；不要在看到结果后给“显著”的面板加星号。若需要显著性标记，图注应同时给出比较、效应量、区间和多重比较处理。

## 导出格式和文件检查怎么做？

```python
from pathlib import Path

out = Path("figures")
out.mkdir(exist_ok=True)
fig.savefig(out / "stress-panel.pdf", bbox_inches="tight")
fig.savefig(out / "stress-panel.svg", bbox_inches="tight")
fig.savefig(out / "stress-panel.png", dpi=300, bbox_inches="tight")
```

- **PDF/SVG**：通常保留文字和线条的矢量信息，适合图表；确认目标期刊是否接受以及字体是否嵌入。
- **PNG/TIFF**：是位图；分辨率、最终尺寸和压缩方式要同时按指南检查。不要把屏幕截图当作位图交付。
- **色彩空间**：RGB、CMYK 或灰度要求取决于期刊和出版流程；只有在指南明确要求时转换，并在转换后重新检查颜色语义。
- **源文件**：保存脚本、输入数据的版本、环境文件、导出命令和图注文本；文件名不要只写 `final2.png`。

导出后至少打开一次每种格式：检查文字是否被裁切、透明度是否改变、字体是否替换、图例是否溢出、线宽是否在缩放后仍可见。多面板还要检查面板字母和图注引用是否一致。

## 常见问题与排错

| 现象 | 可能原因 | 处理方向 |
| --- | --- | --- |
| PDF 中字体变成另一种 | 目标机器没有该字体或未嵌入 | 使用团队可用字体；按目标系统重新渲染并检查嵌入 |
| PNG 清晰但印刷很小 | 只提高 dpi，没有固定最终尺寸 | 先固定版面尺寸，再按指南设 dpi |
| 图例和正文颜色含义相反 | 调色板顺序随因子排序变化 | 显式指定颜色字典和排序，并做黑白检查 |
| 坐标截断后差异显得巨大 | `limits` 或视窗隐藏了完整范围 | 恢复完整坐标，或在图注说明截断理由 |
| 误差带与结果表不一致 | 图画的是简单均值，表是模型估计 | 由同一模型生成估计、区间和绘图表 |
| 合并图后面板比例不同 | 每个面板单独设定尺寸/坐标 | 共享范围和比例；在最终画布上统一排版 |

## 投稿前验收清单

- [ ] 图中每个点、线、面和区间都能追溯到数据或模型输出。
- [ ] 图注说明观测单位、样本量、统计变换、区间定义、缺失处理和缩写。
- [ ] 目标期刊的尺寸、格式、分辨率、色彩和字体要求已记录核查日期。
- [ ] 颜色、线型、形状在图例和正文中含义一致，黑白/色觉缺陷预览仍可读。
- [ ] 轴标签包含单位或范围，视窗没有无意删除观测，注释不是事后挑结果。
- [ ] PDF/SVG/PNG 均打开检查，源代码、环境和图注已归档。

## 资源与工具

<ResourceGrid :min="200">
  <ResourceCard name="APA Style · Figures" desc="图表元素与图注写法" href="https://apastyle.apa.org/style-grammar-guidelines/tables-figures/figures" icon="📑" />
  <ResourceCard name="Nature 作者指南" desc="作者与投稿准备入口" href="https://www.nature.com/nature-portfolio/for-authors" icon="🧾" />
  <ResourceCard name="matplotlib savefig" desc="尺寸、格式与导出参数" href="https://matplotlib.org/stable/api/_as_gen/matplotlib.figure.Figure.savefig.html" icon="🧰" />
  <ResourceCard name="ggplot2 ggsave" desc="R 图形导出参考" href="https://ggplot2.tidyverse.org/reference/ggsave.html" icon="📘" />
</ResourceGrid>

## 延伸阅读

- APA Style [Figures](https://apastyle.apa.org/style-grammar-guidelines/tables-figures/figures)（访问日期：2026-08-25；具体投稿要求以目标期刊指南为准）。
- Nature Portfolio [作者与投稿入口](https://www.nature.com/nature-portfolio/for-authors)（访问日期：2026-08-25；具体图形规范仍以目标期刊页面为准）。
- Wilke, C. O. (2019). *Fundamentals of Data Visualization*. O’Reilly. [在线版](https://clauswilke.com/dataviz/)。它适合检查视觉编码和版式取舍，不替代期刊的文件规范。
