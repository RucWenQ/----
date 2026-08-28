---
title: 4.3 R · ggplot2
description: 用同一份长表完成映射、统计变换、分面与投稿级导出
---

# 4.3 R · ggplot2

::: tip 本节目标
读完后，你能从一份可复现的长表开始，用 ggplot2 逐层画出“干预 × 时间”的心理学结果图，解释每段代码的数据映射与统计变换，并手动调整图例、颜色、字体、坐标、布局和注释。
:::

## 什么时候用 ggplot2，什么时候先停下来？

ggplot2 适合把数据映射为可审计的静态图：每一层都能回到数据列、统计变换和导出参数。它不替你决定研究问题，也不自动处理重复测量、抽样权重或复杂模型。先在[图的语法](./grammar)中确认观测结构，再在[常用图谱](./common-charts)中选择要显示的统计量；若误差条、模型区间或缺失处理无法说清，先请导师或统计顾问复核。

贯穿示例是**模拟数据**，不是研究结果：40 名被试（`id`）各有 pre/post 压力评分，`condition` 有 control / intervention 两组。长表每行是一次观测，适合 `x = time`、`y = stress` 的映射。

## 准备：建立项目和数据检查

### 1. 固定版本和输出目录

```r
install.packages("ggplot2")       # 只需首次安装；正式项目记录安装日期
library(ggplot2)
packageVersion("ggplot2")         # 把版本写进分析日志
dir.create("figures", showWarnings = FALSE)
```

软件界面和函数参数会变动。提交前锁定 R、ggplot2 和相关包版本（例如用 `renv::snapshot()`），不要只保存最后一张图片。

### 2. 用代码生成一份可复核的教学数据

```r
set.seed(2026)  # 模拟数据；真实研究请读取原始数据的清理副本
n_id <- 40
id_tbl <- data.frame(
  id = sprintf("P%02d", seq_len(n_id)),
  condition = rep(c("control", "intervention"), each = n_id / 2),
  baseline = round(rnorm(n_id, mean = 55, sd = 10), 1)
)

long_df <- merge(
  id_tbl,
  data.frame(id = rep(sprintf("P%02d", seq_len(n_id)), each = 2),
             time = rep(c("pre", "post"), n_id)),
  by = "id"
)
long_df$time <- factor(long_df$time, levels = c("pre", "post"))
long_df$condition <- factor(long_df$condition,
                            levels = c("control", "intervention"))
long_df$stress <- round(pmin(pmax(
  long_df$baseline + ifelse(long_df$condition == "intervention" & long_df$time == "post", -7, 0) +
    ifelse(long_df$time == "post", rnorm(nrow(long_df), 0, 5), rnorm(nrow(long_df), 0, 4)),
  0), 100), 1)

stopifnot(nrow(long_df) == 80,
          !anyNA(long_df[c("id", "condition", "time", "stress")]))
```

`stopifnot()` 是轻量的结构检查：这里期望 40 × 2 = 80 行且关键列无缺失。正式分析还要检查重复 id、时间顺序、单位、范围和缺失机制；不要仅凭一张图发现这些问题。

## 第一步：先画原始观测，不急着加均值

```r
p_raw <- ggplot(long_df, aes(x = time, y = stress)) +
  geom_point(aes(colour = condition),
             position = position_jitter(width = 0.08, height = 0),
             alpha = 0.55, size = 2) +
  labs(x = "时间", y = "压力评分（0–100）", colour = "条件") +
  theme_minimal(base_size = 11)
p_raw
```

- `ggplot(long_df, ...)` 指定所有图层默认使用的数据集。
- `aes(x, y)` 是数据映射；每个点对应一行观测。
- `aes(colour = condition)` 放在点层，所以颜色有组别图例；`alpha`、`size` 是不随数据变化的设置。
- `position_jitter()` 只改变绘制位置以减少重叠，不改变数据表中的数值；抖动宽度要足够小并在图注中说明。

先看原始点能发现天花板、离群点和组间分布差异。若只画均值，读者会误以为每组分布都对称且没有个体差异。

## 第二步：增加统计摘要，但声明“统计量是什么”

```r
p_summary <- p_raw +
  stat_summary(aes(colour = condition, group = condition),
               fun = mean, geom = "line", linewidth = 0.9,
               position = position_dodge(width = 0.12)) +
  stat_summary(aes(colour = condition, group = condition),
               fun.data = mean_cl_boot, geom = "errorbar",
               width = 0.10, position = position_dodge(width = 0.12))
p_summary
```

`stat_summary()` 会在每个 `time × condition` 单元内计算均值；`mean_cl_boot` 给出 bootstrap 置信区间。它不是多层模型的区间，也不是个体变化范围。若模型已经估计了协变量调整后的边际均值，应把模型预测值整理成新表后再用 `geom_line()` / `geom_ribbon()` 画，而不要把简单均值和模型区间混在一层。

### 可选：画每个人的变化轨迹

```r
ggplot(long_df, aes(time, stress, group = id, colour = condition)) +
  geom_line(alpha = 0.20) +
  geom_point(alpha = 0.45) +
  stat_summary(aes(group = condition), fun = mean,
               geom = "line", linewidth = 1.1)
```

`group = id` 让线连接同一被试的两个时间点；若忘记它，ggplot2 会把同一条件的所有点连成一条错误的折线。粗线是组均值，细线是个体轨迹；图注要把两者区分开。

## 第三步：用分面拆问题，而不是堆颜色

```r
p_facet <- p_summary +
  facet_wrap(~ condition, nrow = 1, scales = "fixed") +
  labs(title = "压力评分的时间变化",
       subtitle = "点为个体观测；线为组均值；误差条为 bootstrap 95% CI")
p_facet
```

`facet_wrap()` 为每个条件创建面板。这里保留共同 y 轴，方便比较水平；只有在各面板量纲确实不同且图注明确时才用 `scales = "free"`。分面不是增加样本量的方式，面板太多时应拆成多个问题或使用小 multiples。

## 第四步：手动调整颜色、图例和主题

```r
p_styled <- p_facet +
  scale_colour_manual(
    values = c(control = "#2166AC", intervention = "#B2182B"),
    labels = c(control = "控制", intervention = "干预"),
    drop = FALSE,
    name = "实验条件"
  ) +
  scale_x_discrete(labels = c(pre = "干预前", post = "干预后"),
                   name = NULL) +
  scale_y_continuous(limits = c(0, 100), breaks = seq(0, 100, 20),
                     expand = expansion(mult = c(0.02, 0.05)),
                     name = "压力评分（0–100）") +
  theme_classic(base_size = 11) +
  theme(
    plot.title = element_text(face = "bold", size = 14),
    plot.subtitle = element_text(size = 10, colour = "grey30"),
    axis.title = element_text(face = "bold"),
    axis.text = element_text(colour = "black"),
    legend.position = "top",
    legend.title = element_text(face = "bold"),
    strip.background = element_rect(fill = "grey92", colour = NA),
    strip.text = element_text(face = "bold"),
    panel.spacing = unit(1.2, "lines")
  )
p_styled
```

这里每一项都可审计：`scale_colour_manual()` 固定颜色和中文标签；`scale_y_continuous()` 只适合已知的理论量表范围。若只是想放大可见区间，不要用 `limits` 删除超出范围的行，而用 `coord_cartesian(ylim = c(20, 90))`，并在图注说明视窗。`theme()` 只改变版式，不改变数据和统计结果。

### 注释应该标记什么？

```r
p_annotated <- p_styled +
  annotate("text", x = 2, y = 96, label = "预先计划的 post 比较",
           size = 3.2, hjust = 1) +
  annotate("segment", x = 1.85, xend = 2, y = 92, yend = 88,
           arrow = arrow(length = unit(0.12, "cm")))
p_annotated
```

注释应解释设计、阈值或预先计划的比较；不要在看到 p 值后只给“显著”的一组加星号。若确实报告显著性，图注应同时给出比较、效应量、区间和多重比较处理。

## 第五步：导出并留下可复现的检查点

```r
ggsave("figures/stress-time.pdf", p_annotated,
       width = 170, height = 110, units = "mm", device = cairo_pdf)
ggsave("figures/stress-time.png", p_annotated,
       width = 170, height = 110, units = "mm", dpi = 300)

# 导出前把这些信息写入日志或 sessionInfo.txt
sessionInfo()
```

矢量格式适合线条和文字，位图分辨率和尺寸要一起指定；不能把一张屏幕截图当作投稿文件。打开导出的 PDF/PNG，检查字体是否嵌入、图例是否被裁掉、黑白打印和色觉缺陷模拟是否仍可读。

## 常见报错与排错顺序

| 报错/现象 | 原因 | 处理 |
| --- | --- | --- |
| `object 'condition' not found` | 列名拼写或图层换了数据 | `names(long_df)`、`str(long_df)`，并在图层显式写 `data =` |
| 线把所有被试连在一起 | 缺少 `group = id` | 在个体轨迹层设 `group = id`，在均值层设 `group = condition` |
| `Removed rows containing missing values` | 该层遇到 NA 或坐标限制 | 先统计缺失；不要为消除警告而静默删除；检查 `limits` 与单位 |
| 颜色图例有多余类别 | 因子水平或 `drop` 设置不符 | 明确 `factor(levels = ...)`，并记录被排除的水平 |
| 字体/中文在服务器上乱码 | 系统字体不可用 | 指定已安装字体，或在导出前嵌入；在目标系统渲染检查 |
| 区间条和模型表不一致 | 画的是简单均值或不同协方差估计 | 由同一模型生成预测表，再绘图并在图注注明方法 |

## 最小验收清单

- [ ] 每一行数据的观测单位、重复结构和缺失规则写在代码或图注里。
- [ ] 每个颜色、形状和分面都有研究问题上的理由。
- [ ] 图层使用的统计变换、误差条类型、区间水平和模型已记录。
- [ ] 轴标签包含单位或量表范围，零点和视窗没有误导读者。
- [ ] 代码能从干净环境重跑，并生成同名的 PDF/PNG；版本和日期已记录。

## 资源与工具

<ResourceGrid :min="200">
  <ResourceCard name="ggplot2 官方参考" desc="图层、尺度与主题函数" href="https://ggplot2.tidyverse.org/reference/" icon="📘" />
  <ResourceCard name="ggplot2-book" desc="作者维护的逐章教程" href="https://ggplot2-book.org/" icon="📚" />
  <ResourceCard name="Tidyverse 生命周期" desc="识别稳定与实验性函数" href="https://lifecycle.r-lib.org/" icon="🔧" />
</ResourceGrid>

## 延伸阅读

- Wickham, H., et al. (2023). *ggplot2: Elegant Graphics for Data Analysis*（3rd ed.）. [在线版](https://ggplot2-book.org/)。
- ggplot2 官方文档的 [Layers](https://ggplot2.tidyverse.org/reference/) 与 [ggsave](https://ggplot2.tidyverse.org/reference/ggsave.html) 页面（访问日期请在项目日志记录）。
- 如果需要对交互或路径模型作图，参见[常用图谱](./common-charts)；如果要先检查图层和映射的概念，参见[图的语法](./grammar)。
