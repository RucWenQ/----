---
title: 4.1 图的语法（GoG）
description: 从数据结构到图层、统计变换与可复现导出
---

# 4.1 图的语法（GoG）

::: tip 本节目标
读完后，你能把一个心理学研究问题拆成数据、视觉映射、几何对象和统计变换，逐层搭出一张图，并在导出前检查它是否真的回答了问题。
:::

## 你带着什么问题来？

“我有两组被试、三次测量，应该画什么？”不是先查图表目录，而是先问四件事：**每一行数据代表什么观测**、要比较哪一个量、哪些变量需要分组、读者要看到不确定性还是原始分布。图的语法（Grammar of Graphics，GoG）把一张图看成若干可组合的声明，而不是某个软件的固定菜单。

贯穿示例使用一份明确标为**模拟数据**的教学数据：40 名被试被随机分到 control / intervention，两次测量（pre / post），结果变量是 0–100 的压力评分。长表中一行是“一个被试在一个时间点的评分”，因此 `id` 会重复两次；这和把每位被试汇总成一行的宽表不是同一个观测结构。

```text
id   condition      time   stress
01   control        pre       62
01   control        post      59
02   intervention   pre       64
02   intervention   post      48
```

## 先把图拆成哪些零件？

可以把声明顺序记成：`data → mapping → geom → stat → position → facet → scale → coord → theme`。它们并非都要手动写，但每一层都回答一个可检查的问题。

| 零件 | 它决定什么 | 示例 | 常见误区 |
| --- | --- | --- | --- |
| `data` | 使用哪些行、观测单位是什么 | `long_df` | 把汇总表当作个体数据，重复计权 |
| `aes()` 映射 | 数据列如何变成位置、颜色、形状、大小 | `x = time, y = stress, colour = condition` | 把分类变量当连续轴，或把颜色写死在映射里 |
| `geom_*()` 几何对象 | 画点、线、柱、区间还是瓦片 | `geom_point()` | 用柱高暗示不存在的零点，遮住原始分布 |
| `stat_*()` 统计变换 | 几何对象前如何汇总或计算 | `stat_summary()`、`stat_smooth()` | 把均值线说成每位被试的轨迹 |
| `position` | 同一位置的对象如何错开或堆叠 | `position_dodge()`、`position_jitter()` | 让抖动改变了真实数据位置 |
| `facet_*()` 分面 | 用哪个变量拆成多个小面板 | `facet_wrap(~ condition)` | 面板过多，读者无法比较尺度 |
| `scale_*()` | 刻度、标签、颜色和缺失值 | `scale_y_continuous(limits = c(0, 100))` | 直接删掉超出 limits 的观测 |
| `coord_*()` | 坐标系和视窗 | `coord_cartesian(ylim = c(20, 90))` | 用坐标裁剪替代数据过滤，或反过来 |
| `theme_*()` | 非数据性的版式 | `theme_classic()` | 用装饰掩盖低信息量图形 |

### 映射和设置为什么要分开？

`aes(colour = condition)` 表示颜色随每一行数据变化，ggplot2 会生成图例；`colour = "#B2182B"` 则是把所有对象设置成同一个颜色，不会生成图例。把常量写进 `aes()` 会把它当成名为 `"#B2182B"` 的类别，产生令人困惑的图例。

```r
# 模拟数据；实际研究请从已清理的分析数据读入
set.seed(2026)
long_df <- data.frame(
  id = rep(sprintf("P%02d", 1:40), each = 2),
  condition = rep(rep(c("control", "intervention"), each = 20), each = 2),
  time = rep(c("pre", "post"), 40),
  stress = round(pmin(pmax(rnorm(80, 55, 12), 0), 100), 1)
)

library(ggplot2)
ggplot(long_df, aes(x = time, y = stress, colour = condition)) +
  geom_point(position = position_jitterdodge(jitter.width = 0.08), alpha = 0.55) +
  stat_summary(aes(group = condition), fun = mean, geom = "line",
               position = position_dodge(width = 0.25), linewidth = 0.8) +
  stat_summary(aes(group = condition), fun.data = mean_cl_boot,
               geom = "errorbar", width = 0.12,
               position = position_dodge(width = 0.25))
```

这段图形有三种对象：半透明点保留个体分布，均值线回答“组均值怎样随时间变化”，误差条显示均值的不确定性。`mean_cl_boot` 是 bootstrap 置信区间；它不是“每个人的变化范围”，也不自动解决重复测量的依赖。若研究问题是个体变化，应画被试轨迹或使用与重复结构相符的模型（见[多层模型](/3-statistics/multilevel)）。

## 一个最短的决策路径

1. 写一句读图问题：是比较分布、变化趋势、关联，还是展示模型结果？
2. 写出观测单位和变量类型：个体、试次、时间点或研究；连续、分类、计数或效应量。
3. 选择几何对象：点图看分布，线图看有序变化，瓦片看二维矩阵，区间图看估计与不确定性。
4. 决定统计变换：原始值、均值/中位数、密度、回归预测或模型边际均值。图注写清楚。
5. 只把真正需要比较的变量映射到颜色、形状或分面；其余变量放在图注或附表。
6. 先用默认尺度和主题检查数据，再手调颜色、字体、坐标、图例和注释；最后用固定尺寸导出。

## 怎样从“图层”读懂一张图？

以“干预前后压力评分”为例：

- 点层的 `x = time, y = stress` 把每次观测放到平面；颜色编码组别。
- 线层把同一组同一时间的均值连接起来。连接的是**汇总后的点**，不是被试轨迹。
- 区间层把估计的不确定性画出来。注明是标准误、95% 置信区间还是后验区间。
- 分面可以把 `condition` 拆开，但如果目的是比较组间差异，保留共同的 y 轴通常更直接。
- 注释只标记预先计划的比较或关键阈值；不要只给显著的格子加星号。

::: warning 何时不要用 GoG 图层硬凑？
如果数据来自复杂抽样、重复测量或多层模型，简单均值图可以用于探索，但不能替代模型估计。图中的误差条必须与分析模型的估计对象一致；不确定时先保留原始数据，再请熟悉设计的统计顾问复核。
:::

## 如何检查一张图是否诚实？

- 把图中的一个点追溯回原始数据行：是否被重复计算、过滤或隐式汇总？
- 对照分析计划：颜色、分面和注释是否引入了事后挑选？
- 检查坐标范围、缺失值、异常值和单位；`coord_cartesian()` 只是改变视窗，`scale_* (limits=)` 可能丢弃数据。
- 对估计图，记录模型、协变量、对比方式和区间定义；不要把视觉重叠当作显著性检验。
- 用黑白打印和色觉缺陷模拟预览；信息不能只依赖颜色。

## 结果如何导出？

```r
p <- ggplot(long_df, aes(time, stress, colour = condition)) +
  geom_point(position = position_jitterdodge(jitter.width = 0.08), alpha = 0.5)
ggsave("figures/stress-by-time.pdf", p, width = 150, height = 100,
       units = "mm", device = cairo_pdf)
ggsave("figures/stress-by-time.png", p, width = 150, height = 100,
       units = "mm", dpi = 300)
```

导出前把代码、数据版本、软件版本和图形尺寸一起记录。PDF/SVG 适合线条和文字，PNG 适合照片或期刊明确要求的位图；最终格式以投稿指南为准。

## 资源与工具

<ResourceGrid :min="200">
  <ResourceCard name="ggplot2 官方参考" desc="函数、参数与示例" href="https://ggplot2.tidyverse.org/reference/" icon="📘" />
  <ResourceCard name="Grammar of Graphics 书籍" desc="图形语法的完整背景" href="https://link.springer.com/book/10.1007/0-387-28695-0" icon="📚" />
  <ResourceCard name="ggplot2-book" desc="作者维护的实操作品" href="https://ggplot2-book.org/" icon="🛠️" />
</ResourceGrid>

## 延伸阅读

- Wilkinson, L. (2005). *The Grammar of Graphics* (2nd ed.). Springer. [DOI: 10.1007/0-387-28695-0](https://doi.org/10.1007/0-387-28695-0)。
- Wickham, H., et al. (2023). *ggplot2: Elegant Graphics for Data Analysis*（3rd ed.）. [在线版](https://ggplot2-book.org/)。版本与访问日期应在项目记录中写明。
