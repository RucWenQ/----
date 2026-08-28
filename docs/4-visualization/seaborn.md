---
title: 4.4 Python · seaborn
description: 用 seaborn 与 matplotlib 从长表到可复现的心理学结果图
---

# 4.4 Python · seaborn

::: tip 本节目标
读完后，你能把心理学数据整理成长表，用 seaborn 选择合适的几何对象和统计摘要，手动调整图例、颜色、字体、坐标、分面与注释，并导出一份可复核的 PDF/PNG。示例以 seaborn 0.13 系列的 API 为准；运行前请打印本机版本。
:::

## 你什么时候会选择 seaborn？

如果数据已经在 pandas `DataFrame` 中，且目标是探索分布、比较组别或展示模型生成的预测值，seaborn 能用较少代码生成有合理默认主题的图。它建立在 matplotlib 之上：seaborn 负责统计图层和调色，matplotlib 负责坐标轴、图例、字体、画布和文件导出。

它不会替你决定统计模型，也不会把重复测量变成独立观测。先在[图的语法](./grammar)中确认每行是什么，再在[常用图谱](./common-charts)中确定要显示的估计量；需要 R 的逐层语法时可看 [ggplot2](./ggplot2)。

贯穿示例是一份明确标为**模拟数据**的教学数据：40 名被试各有 `pre`/`post` 两次压力评分，20 人在 `control`，20 人在 `intervention`。长表一行是“一个被试在一个时间点的观测”，不是 80 个独立被试。

## 先准备环境和数据

### 1. 记录版本

在项目环境（而不是系统全局环境）中安装并记录版本。以下命令只需在首次建立环境时运行；核查日期为 2026-08-25，函数参数仍应以本机文档为准。

```bash
python -m pip install seaborn matplotlib pandas numpy
python -c "import seaborn, matplotlib, pandas, numpy; print(seaborn.__version__, matplotlib.__version__, pandas.__version__, numpy.__version__)"
```

如果团队用 `uv`、conda 或 `venv`，把环境文件（如 `requirements.txt` 或 `environment.yml`）一起保存。`seaborn` 0.12 以后常用 `errorbar=` 参数；旧版本可能需要 `ci=`，不要把两套写法混在同一脚本里。

### 2. 生成并检查教学数据

```python
from pathlib import Path
import numpy as np
import pandas as pd

rng = np.random.default_rng(2026)  # 模拟数据；真实项目读取清理后的副本
n_id = 40
ids = np.array([f"P{i:02d}" for i in range(1, n_id + 1)])
condition_by_id = np.repeat(["control", "intervention"], n_id // 2)
baseline_by_id = rng.normal(55, 10, n_id)

rows = []
for pid, condition, baseline in zip(ids, condition_by_id, baseline_by_id):
    for time in ["pre", "post"]:
        shift = -7 if condition == "intervention" and time == "post" else 0
        noise = rng.normal(0, 5 if time == "post" else 4)
        stress = np.clip(baseline + shift + noise, 0, 100)
        rows.append((pid, condition, time, round(float(stress), 1)))

long_df = pd.DataFrame(rows, columns=["id", "condition", "time", "stress"])
long_df["time"] = pd.Categorical(long_df["time"], ["pre", "post"], ordered=True)
long_df["condition"] = pd.Categorical(
    long_df["condition"], ["control", "intervention"]
)

assert long_df.shape == (80, 4)
assert long_df["id"].nunique() == 40
assert long_df.groupby(["condition", "time"], observed=True).size().eq(20).all()
assert long_df["stress"].between(0, 100).all()
```

四个 `assert` 是最小的结构验收：80 行、40 个被试、每个条件 × 时间单元 20 行、量表范围有效。正式数据还要检查重复键、缺失机制、单位和脱敏状态。模拟结果只能练习代码，不能写进论文。

## 从原始点开始：数据映射和几何对象

先画原始观测，再决定是否叠加均值或模型预测。`x`、`y`、`hue` 是**数据映射**；`alpha`、`s` 和颜色常量是**视觉设置**。映射会生成图例，设置不会。

```python
import matplotlib.pyplot as plt
import seaborn as sns

sns.set_theme(style="whitegrid", context="notebook")
fig, ax = plt.subplots(figsize=(6.2, 4.2))
sns.stripplot(
    data=long_df, x="time", y="stress", hue="condition",
    order=["pre", "post"], hue_order=["control", "intervention"],
    dodge=True, jitter=0.08, alpha=0.55, size=4, ax=ax,
)
ax.set(xlabel="时间", ylabel="压力评分（0–100）")
ax.legend(title="实验条件", frameon=False, ncol=2)
fig.tight_layout()
```

`stripplot` 仍然把每行观测画出来；`jitter` 只改变屏幕上的位置以减少重叠，不改变分析数据。若把 `hue` 放错列，或先把每位被试汇总再画点，就会改变读者对观测结构的理解。

## 怎样叠加统计摘要而不掩盖分布？

`lineplot` 可以在每个 `time × condition` 单元计算均值并画出不确定性带。带子是均值估计的区间，不是每个人的变化范围；重复测量研究若要做推断，应使用与设计相符的模型，再绘制模型的边际预测。

```python
fig, ax = plt.subplots(figsize=(6.2, 4.2))
palette = {"control": "#2166AC", "intervention": "#B2182B"}

sns.stripplot(
    data=long_df, x="time", y="stress", hue="condition",
    order=["pre", "post"], hue_order=list(palette),
    dodge=True, jitter=0.08, alpha=0.35, size=3.5, palette=palette,
    legend=False, ax=ax,
)
sns.lineplot(
    data=long_df, x="time", y="stress", hue="condition",
    order=["pre", "post"], hue_order=list(palette), palette=palette,
    estimator="mean", errorbar=("ci", 95), marker="o", linewidth=2,
    err_style="band", ax=ax,
)
ax.set(xlabel="时间", ylabel="压力评分（0–100）")
ax.legend(title="实验条件", frameon=False, loc="upper right")
fig.tight_layout()
```

逐段检查：

1. 两个函数都接收同一份长表，避免摘要和原始点来自不同筛选。
2. `estimator="mean"` 明确线代表均值；`errorbar=("ci", 95)` 是 seaborn 的 bootstrap 置信区间设置，版本较旧时按本机文档改写。
3. `palette` 固定颜色含义；不要让颜色顺序随数据排序变化。
4. 若要画模型估计，把模型输出整理成 `time`、`condition`、`estimate`、`lower`、`upper` 列，再用 `ax.plot` 与 `ax.fill_between`，不要把简单均值区间冒充模型区间。

## 分面、图例和坐标怎样手动控制？

分面适合回答“每个条件的分布是否相似”，但比较组间水平时要保留共同坐标。`FacetGrid` 会为每个条件建立一个轴，随后仍可逐轴设置标签和范围。

```python
g = sns.FacetGrid(
    long_df, col="condition", col_order=["control", "intervention"],
    height=3.2, aspect=1.05, sharey=True,
)
g.map_dataframe(
    sns.stripplot, x="time", y="stress", order=["pre", "post"],
    color="#4C4C4C", jitter=0.08, alpha=0.55, size=3.5,
)
g.set_axis_labels("时间", "压力评分（0–100）")
g.set_titles("{col_name}")
for ax in g.axes.flat:
    ax.set_ylim(0, 100)
    ax.grid(axis="x", visible=False)
g.figure.suptitle("按条件分面的原始观测", y=1.04, fontsize=13, fontweight="bold")
g.figure.tight_layout()
```

如果各面板的量纲不同，才考虑 `sharey=False`，并在图注明确“每个面板独立坐标”。不要用自由坐标制造组间差异的错觉。

## 字体、注释和导出如何保持可复现？

把版式参数写进脚本，避免只在 GUI 里拖动。中文字体名称必须是目标机器已安装的字体；先用 `matplotlib.font_manager` 检查，不能假定服务器上有同一字体。

```python
from matplotlib import rcParams

rcParams.update({
    "font.size": 10,
    "axes.titlesize": 13,
    "axes.labelsize": 11,
    "xtick.labelsize": 10,
    "ytick.labelsize": 10,
    "legend.fontsize": 9,
    "axes.spines.top": False,
    "axes.spines.right": False,
})

fig, ax = plt.subplots(figsize=(170 / 25.4, 110 / 25.4))  # mm → inch
sns.lineplot(
    data=long_df, x="time", y="stress", hue="condition",
    hue_order=["control", "intervention"], palette=palette,
    estimator="mean", errorbar=("ci", 95), marker="o", ax=ax,
)
ax.set(xlabel="时间", ylabel="压力评分（0–100）", ylim=(0, 100))
ax.annotate(
    "预先计划的 post 比较", xy=(1, 48), xytext=(0.55, 90),
    arrowprops={"arrowstyle": "->", "color": "#333333"}, fontsize=9,
)
ax.legend(title="实验条件", frameon=False, ncol=2, loc="upper right")
fig.tight_layout()
Path("figures").mkdir(exist_ok=True)
fig.savefig("figures/stress-time.pdf", bbox_inches="tight")
fig.savefig("figures/stress-time.png", dpi=300, bbox_inches="tight")
```

`figsize`、字体、图例位置和 `bbox_inches` 都是输出的一部分；导出后打开 PDF/PNG 检查裁切、字体替换、线宽、黑白打印和色觉缺陷下的可辨识度。投稿所需的尺寸、色彩空间和文件格式以目标期刊当期指南为准。

## 常见报错和排错顺序

| 现象 | 先检查 | 处理方向 |
| --- | --- | --- |
| `Could not interpret value ...` | 列名、`data=` 和当前工作目录 | `long_df.columns`、`long_df.head()`；在每层显式传 `data` |
| 图例顺序每次不同 | 分类水平和 `hue_order` | 用 `Categorical` 固定水平，显式指定 `hue_order` |
| 线把不同被试连在一起 | 是否把个体轨迹误画成汇总线 | 轨迹图设 `units="id"` 或先确认只画模型/均值线 |
| `errorbar` 参数报错 | seaborn 版本过旧 | 打印版本；旧 API 使用文档对应的 `ci`，并锁定环境 |
| `Removed ... rows` 或区间异常 | 缺失、范围和坐标限制 | 先统计 NA 与范围；不要为了消警告静默删行 |
| 中文乱码或图例被裁切 | 字体可用性、`tight_layout`、导出尺寸 | 检查字体并在目标系统渲染，必要时调整 `bbox_inches` |

## 最小验收清单

1. 每行观测单位、重复结构和缺失处理写在代码或图注中。
2. 每个 `hue`、分面和注释都对应一个读图问题；颜色不是装饰。
3. 区间类型、统计估计量、模型和软件版本可追溯。
4. 轴标签包含单位或量表范围；放大视窗没有悄悄删除数据。
5. 从干净环境重跑能生成同名 PDF/PNG，并能在黑白和色觉缺陷预览中阅读。

## 资源与工具

<ResourceGrid :min="200">
  <ResourceCard name="seaborn 官方文档" desc="函数、统计估计与示例画廊" href="https://seaborn.pydata.org/" icon="🐍" />
  <ResourceCard name="seaborn API" desc="plotting 与 errorbar 参数" href="https://seaborn.pydata.org/api.html" icon="📘" />
  <ResourceCard name="matplotlib 官方文档" desc="坐标轴、主题和导出" href="https://matplotlib.org/stable/" icon="🧰" />
  <ResourceCard name="pandas 数据结构" desc="DataFrame 与分组整理" href="https://pandas.pydata.org/docs/" icon="🧮" />
</ResourceGrid>

## 延伸阅读

- seaborn [用户指南](https://seaborn.pydata.org/tutorial.html) 与 [API 参考](https://seaborn.pydata.org/api.html)（访问日期：2026-08-25；版本以本机 `seaborn.__version__` 为准）。
- matplotlib [Figure and axes guide](https://matplotlib.org/stable/users/explain/figure/figure_intro.html) 与 [`savefig` 参考](https://matplotlib.org/stable/api/_as_gen/matplotlib.figure.Figure.savefig.html)。
- 需要先决定统计问题和图型时，回到[常用图谱](./common-charts)；需要逐层理解映射与统计变换时，阅读[图的语法](./grammar)。
