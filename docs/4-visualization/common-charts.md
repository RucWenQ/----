---
title: 4.2 常用图谱
description: 按统计问题选择路径图、热力图与 Johnson–Neyman 图
---

# 4.2 常用图谱

::: tip 本节目标
读完后，你能根据数据结构和统计问题选择图型，画出路径系数图、相关热力图和调节效应的 Johnson–Neyman 图，并在图注中交代估计量、不确定性和软件版本。
:::

## 先问“我要让读者比较什么？”

图型不是统计方法的替代品。先写清模型和估计对象，再选图，能避免“看起来很专业但回答不了问题”。下表把常见问题、数据结构、分析方法和图型放在一起：

| 研究问题 | 典型变量/观测结构 | 先做的分析 | 图型与应显示的量 |
| --- | --- | --- | --- |
| 哪些构念之间有关联？ | 每行一个被试，多个连续变量 | Pearson/Spearman 相关或协方差模型 | 相关热力图；标注 `r`、样本量和缺失处理 |
| 假设的过程路径是否与数据相容？ | 被试层的观测变量或潜变量 | 中介/SEM | 路径图；显示标准化系数、区间，区分测量与结构模型 |
| X 对 Y 的作用是否因 W 而变？ | 被试层交互，或有重复/嵌套结构 | 线性模型或多层模型 | 预测线、简单斜率和 Johnson–Neyman 区域 |
| 不同时间/条件的分布怎样变化？ | 长表：被试 × 时间/条件 | 描述统计或混合模型 | 点/箱线/雨云图；保留个体或模型不确定性 |
| 两个分类变量如何组合？ | 列联表、计数 | 卡方或对数线性模型 | 比例条形图或马赛克图；说明分母 |

贯穿示例仍是**模拟数据**：40 名被试完成干预前后压力评分；另有自我效能 `self_efficacy` 和感知支持 `support`。模拟数据只用于练习代码，不代表真实效应。

## 路径系数图：如何不把箭头当作因果证据？

### 适用和边界

路径图适合压缩展示一个已经明确的回归/SEM 模型：节点是变量或潜变量，箭头是回归路径，双向弧线常表示协方差。它能帮助读者核对模型结构，但**箭头方向来自理论和设计，不是图形自动发现的因果方向**。横断面相关数据、未控制的混杂或有反馈的系统，都不能仅凭显著路径宣称机制。

### 最短操作路径（lavaan + semPlot）

1. 先写出可识别的模型，并明确 X、M、Y 的观测单位。
2. 用 `lavaan::sem()` 估计；报告估计方法、标准化方式和缺失处理。
3. 用 `semPlot::semPaths()` 画图，把系数和置信区间放入图注或旁边表格。
4. 对照模型输出检查每条箭头的符号、标准化定义和区间；不要从节点位置推断强弱。

```r
# 教学示例：模拟数据；真实研究需替换为预先清理的数据
set.seed(2026)
dat <- data.frame(
  stress_pre = rnorm(40, 55, 10),
  support = rnorm(40, 0, 1),
  self_efficacy = rnorm(40, 0, 1),
  stress_post = rnorm(40, 50, 10)
)

library(lavaan)
model <- '
  self_efficacy ~ a*support
  stress_post ~ b*self_efficacy + cprime*support + stress_pre
  indirect := a*b
'
fit <- sem(model, data = dat, estimator = "MLR")
summary(fit, standardized = TRUE, ci = TRUE, fit.measures = TRUE)

library(semPlot)
semPaths(fit, what = "std", whatLabels = "std", layout = "tree",
         edge.label.cex = 0.9, residuals = FALSE)
```

逐段看：`model` 先声明路径和间接效应，`sem()` 才负责估计；`what = "std"` 要和报告中的标准化定义一致；`residuals = FALSE` 只是隐藏残差箭头，不代表模型没有残差。模型拟合、直接/间接效应的区间和测量模型信息应在正文或表格中报告，图只做结构导航。

## 热力图：矩阵颜色怎样保持可读？

### 适用和边界

热力图把一个二维矩阵映射为颜色，适合相关矩阵、缺失模式、脑区 × 条件的均值或模型系数。颜色深浅不等于统计显著；必须说明每个格子的统计量、分母和色标方向。若变量很多，聚类排序会改变阅读顺序，需写出距离和聚类方法。

### 从长表开始

`geom_tile()` 最稳定的输入是长表：每行一个 `row × column` 格子。下面用相关矩阵的下三角作示范；`r` 是教学数据的统计结果字段，实际分析应由 `cor()` 或模型代码生成，不能手填。

```r
library(dplyr)
library(tidyr)
library(ggplot2)

# cor_df 必须由分析代码生成；每格包含 var_x、var_y、r、n
cor_long <- cor_df |>
  mutate(var_x = factor(var_x, levels = c("stress", "support", "self_efficacy")),
         var_y = factor(var_y, levels = c("stress", "support", "self_efficacy")))

ggplot(cor_long, aes(var_x, var_y, fill = r)) +
  geom_tile(colour = "white", linewidth = 0.3) +
  geom_text(aes(label = sprintf("%.2f", r)), size = 3) +
  scale_fill_gradient2(limits = c(-1, 1), midpoint = 0,
                       low = "#2166AC", mid = "white", high = "#B2182B",
                       name = "Pearson r") +
  coord_equal() +
  labs(x = NULL, y = NULL,
       subtitle = "颜色为相关系数；每格的 n 与缺失处理见图注") +
  theme_minimal(base_size = 11) +
  theme(panel.grid = element_blank(), axis.text.x = element_text(angle = 45, hjust = 1))
```

`fill = r` 是数据映射，`scale_fill_gradient2()` 明确了 0 的中性色和范围，`coord_equal()` 让格子保持正方形。不要为了让颜色“更有差异”而截断 `limits`；如果只想放大视窗，先检查数据，再用坐标设置。对于 p 值或 FDR，另做一张图或在标签中注明校正方法，避免把相关大小和显著性混为一谈。

## Johnson–Neyman 图：交互何时从“显著”变成“可解释”？

### 研究问题和数据结构

调节模型问的是：预测变量 `X` 对连续结果 `Y` 的斜率是否随连续调节变量 `W` 改变。每行应是一个独立观测；若是重复测量或班级嵌套，先用多层模型，再提取相应的边际预测。Johnson–Neyman（J–N）图显示 `W` 的哪些取值范围内，简单斜率的置信区间不含 0；它不是“找一个显著阈值”的事后魔法，也不证明因果边界。

### 操作与逐段检查

```r
library(interactions)

# 教学示例：dat 是被试层模拟数据，变量已中心化到可解释的单位
fit <- lm(stress_post ~ support * self_efficacy + stress_pre, data = dat)

interact_plot(fit, pred = support, modx = self_efficacy,
              interval = TRUE, plot.points = TRUE,
              x.label = "感知支持（中心化）",
              y.label = "预测的事后压力评分")
johnson_neyman(fit, pred = support, modx = self_efficacy,
               alpha = .05, control.fdr = TRUE)
```

- `support * self_efficacy` 展开为两个主效应和交互项；遗漏主效应会改变解释。
- `interact_plot()` 画的是模型预测值与区间，不是每个 `W` 水平的原始均值。
- `johnson_neyman()` 的区间取决于模型、协方差估计、`alpha` 和是否控制 FDR；把这些写进图注。
- 把 J–N 边界与 `W` 的实际观测范围叠加。若边界落在样本范围外，结论是“在观测范围内没有识别到转换点”，而不是“所有人都一样”。

报告示例：“在控制基线压力后，绘制 `X × W` 的模型预测值及 95% 置信带；J–N 区域标示简单斜率区间，并报告模型估计、协方差估计方式和 `W` 的观测范围。”不要只写“高/低 W 显著”。

## 常见错误与排错

| 现象 | 先检查 | 修正方向 |
| --- | --- | --- |
| 热力图的格子不是方形 | 是否使用 `coord_equal()`、x/y 是否为因子 | 固定坐标比例并明确排序 |
| 路径图系数与表格对不上 | `what`、`standardized` 和系数列是否一致 | 统一标准化定义，重新导出 |
| J–N 阴影超出数据范围 | 调节变量的实际 min/max 和缺失处理 | 标出观测范围，不外推 |
| 图例重复或出现十六进制颜色 | 常量是否误写在 `aes()` 内 | 把常量移到 `aes()` 外 |
| 线图看似有趋势但每个点样本不同 | 分母、缺失和汇总规则 | 显示 n、原始点或模型边际均值 |

## 导出与复核清单

1. 在图下注明数据版本、分析模型、统计变换、区间类型和软件/包版本。
2. 用独立的表格或代码核对至少一个格子、一个路径系数和一个 J–N 边界。
3. 以 PDF/SVG 和 300 dpi PNG 各导出一份；确认字体嵌入、线宽和色盲可辨识度。
4. 让合作者只看图和图注复述研究问题；若复述不了，说明图层或标签仍过载。

## 资源与工具

<ResourceGrid :min="200">
  <ResourceCard name="lavaan 官方网站" desc="SEM 模型与估计文档" href="https://lavaan.ugent.be/" icon="🔗" />
  <ResourceCard name="semPlot CRAN 文档" desc="路径图函数参考" href="https://cran.r-project.org/package=semPlot" icon="🧭" />
  <ResourceCard name="interactions 文档" desc="交互与 J–N 图" href="https://interactions.jacob-long.com/" icon="📈" />
  <ResourceCard name="ggplot2 geom_tile" desc="热力图图层参考" href="https://ggplot2.tidyverse.org/reference/geom_tile.html" icon="🟦" />
</ResourceGrid>

## 延伸阅读

- Long, J. A. (2024). *interactions: Comprehensive, User-Friendly Toolkit for Probing Interactions*. CRAN 文档与版本随安装日期变化。
- Rosseel, Y. (2012). lavaan: An R Package for Structural Equation Modeling. *Journal of Statistical Software, 48*(2). [DOI: 10.18637/jss.v048.i02](https://doi.org/10.18637/jss.v048.i02)。
- 需要更系统的图形图层与尺度说明时，回到[图的语法（GoG）](./grammar)；需要逐步写 ggplot2 代码时，继续看[ R · ggplot2](./ggplot2)。
