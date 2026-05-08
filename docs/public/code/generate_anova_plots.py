"""
为 3.2.2 ANOVA 章节生成 profile plot 与 bar chart 两版图片。
数据：刻板印象威胁 × 性别 在数学成绩上的 2×2 设计。
"""

import matplotlib.pyplot as plt
import matplotlib.font_manager as fm
import numpy as np

# ---- 字体配置（使用 Noto Sans CJK SC）----
plt.rcParams['font.sans-serif'] = ['Noto Sans CJK SC', 'WenQuanYi Zen Hei', 'DejaVu Sans']
plt.rcParams['axes.unicode_minus'] = False
plt.rcParams['font.size'] = 11

# ---- 数据 ----
conditions = ['威胁条件', '无威胁条件']
female_means = [65.0, 76.0]
female_sd    = [12.0, 11.0]
male_means   = [78.0, 79.0]
male_sd      = [10.0, 11.0]
n_per_cell   = 25

# 标准误 SE = SD / sqrt(n)
female_se = [sd / np.sqrt(n_per_cell) for sd in female_sd]
male_se   = [sd / np.sqrt(n_per_cell) for sd in male_sd]

# ---- 配色（学术风：朱砂红 + 深青蓝）----
COLOR_F = '#C8442E'   # 朱砂红
COLOR_M = '#2C5F7C'   # 深青蓝
GRID    = '#D8D2C2'
INK     = '#2B2B2B'

# =====================================================
#                  图 1：Profile Plot
# =====================================================
fig, ax = plt.subplots(figsize=(7.5, 5.2), dpi=200)
fig.patch.set_facecolor('white')

x = np.arange(len(conditions))

# 女性
ax.errorbar(x, female_means, yerr=female_se,
            color=COLOR_F, marker='o', markersize=11, markerfacecolor=COLOR_F,
            markeredgecolor='white', markeredgewidth=1.2,
            linewidth=2.5, capsize=6, capthick=1.5,
            label='女性', zorder=4)

# 男性
ax.errorbar(x, male_means, yerr=male_se,
            color=COLOR_M, marker='s', markersize=11, markerfacecolor=COLOR_M,
            markeredgecolor='white', markeredgewidth=1.2,
            linewidth=2.5, capsize=6, capthick=1.5,
            label='男性', zorder=4)

# 数值标注
for i, m in enumerate(female_means):
    ax.annotate(f'M = {m:.0f}', (x[i], m),
                xytext=(-12, -22), textcoords='offset points',
                fontsize=10, color=COLOR_F, ha='right', fontweight='bold')
for i, m in enumerate(male_means):
    ax.annotate(f'M = {m:.0f}', (x[i], m),
                xytext=(12, 12), textcoords='offset points',
                fontsize=10, color=COLOR_M, ha='left', fontweight='bold')

# 注释交互
ax.annotate('', xy=(0, 71.5), xytext=(0, 74),
            arrowprops=dict(arrowstyle='-', color='#999', lw=0.8))
ax.text(0.05, 72, '差距 13 分', fontsize=9.5, color='#777',
        style='italic', ha='left')

ax.text(1.05, 77.5, '差距 3 分', fontsize=9.5, color='#777',
        style='italic', ha='left')

# 轴
ax.set_xticks(x)
ax.set_xticklabels(conditions, fontsize=12)
ax.set_xlabel('威胁条件', fontsize=12, color=INK, labelpad=10)
ax.set_ylabel('数学成绩（0–100）', fontsize=12, color=INK, labelpad=10)
ax.set_title('刻板印象威胁 × 性别  在数学成绩上的交互效应',
             fontsize=13, color=INK, pad=15, fontweight='bold')
ax.set_ylim(58, 86)
ax.set_xlim(-0.4, 1.4)

# 图例
leg = ax.legend(loc='lower right', frameon=True, fontsize=11,
                framealpha=0.95, edgecolor=GRID)
leg.get_frame().set_linewidth(0.8)

# 网格
ax.grid(True, alpha=0.5, linestyle='--', color=GRID, zorder=1)
ax.set_axisbelow(True)

# 边框：保留左下，去除上右
for spine in ['top', 'right']:
    ax.spines[spine].set_visible(False)
for spine in ['left', 'bottom']:
    ax.spines[spine].set_color(INK)
    ax.spines[spine].set_linewidth(1)

# 副标题
ax.text(0.5, -0.18, '注：误差线为 ±1 SE。两条线不平行 → 存在交互效应。',
        transform=ax.transAxes, ha='center', fontsize=9.5,
        color='#666', style='italic')

plt.tight_layout()
plt.savefig('/home/claude/figs/anova-profile-plot.png',
            dpi=200, bbox_inches='tight', facecolor='white')
plt.close()
print("✓ profile plot 已生成")

# =====================================================
#                  图 2：Bar Chart 备选
# =====================================================
fig, ax = plt.subplots(figsize=(7.5, 5.2), dpi=200)
fig.patch.set_facecolor('white')

bar_width = 0.35
x_pos = np.arange(len(conditions))

# 女性
bars_f = ax.bar(x_pos - bar_width/2, female_means, bar_width,
                yerr=female_se, color=COLOR_F, alpha=0.88,
                edgecolor='white', linewidth=1.5,
                capsize=6, error_kw=dict(ecolor=INK, capthick=1.5, lw=1.2),
                label='女性', zorder=3)

# 男性
bars_m = ax.bar(x_pos + bar_width/2, male_means, bar_width,
                yerr=male_se, color=COLOR_M, alpha=0.88,
                edgecolor='white', linewidth=1.5,
                capsize=6, error_kw=dict(ecolor=INK, capthick=1.5, lw=1.2),
                label='男性', zorder=3)

# 在柱顶标数值
for bar, m in zip(bars_f, female_means):
    ax.text(bar.get_x() + bar.get_width()/2, m + 3,
            f'{m:.0f}', ha='center', fontsize=10,
            color=COLOR_F, fontweight='bold')
for bar, m in zip(bars_m, male_means):
    ax.text(bar.get_x() + bar.get_width()/2, m + 3,
            f'{m:.0f}', ha='center', fontsize=10,
            color=COLOR_M, fontweight='bold')

# 轴
ax.set_xticks(x_pos)
ax.set_xticklabels(conditions, fontsize=12)
ax.set_xlabel('威胁条件', fontsize=12, color=INK, labelpad=10)
ax.set_ylabel('数学成绩（0–100）', fontsize=12, color=INK, labelpad=10)
ax.set_title('刻板印象威胁 × 性别  在数学成绩上的交互效应',
             fontsize=13, color=INK, pad=15, fontweight='bold')
ax.set_ylim(0, 95)

# 图例
leg = ax.legend(loc='upper left', frameon=True, fontsize=11,
                framealpha=0.95, edgecolor=GRID)
leg.get_frame().set_linewidth(0.8)

# 网格
ax.grid(True, axis='y', alpha=0.5, linestyle='--', color=GRID, zorder=1)
ax.set_axisbelow(True)

# 边框
for spine in ['top', 'right']:
    ax.spines[spine].set_visible(False)
for spine in ['left', 'bottom']:
    ax.spines[spine].set_color(INK)
    ax.spines[spine].set_linewidth(1)

# 副标题
ax.text(0.5, -0.18, '注：误差线为 ±1 SE。',
        transform=ax.transAxes, ha='center', fontsize=9.5,
        color='#666', style='italic')

plt.tight_layout()
plt.savefig('/home/claude/figs/anova-bar-chart.png',
            dpi=200, bbox_inches='tight', facecolor='white')
plt.close()
print("✓ bar chart 已生成")
