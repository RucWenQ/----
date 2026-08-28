# 套话检测（Wording Patterns）

**用途**：用户给研究问题措辞时，顺手扫一眼有没有命中下面这些"通用壳子"。命中就**温和提一句**，然后立刻回到正常追问。

**铁律**：
- 只评**措辞**，不评 idea 好不好、新不新、可不可行。
- **不替用户改写**，除非他明确要。不另外生成替代 idea。
- 不卡流程——用户说"我就要这么写"就放过，可能是他有意为之。
- 匹配要**高置信**才提。措辞模糊、或要靠解读 idea 内容才像，就别提。同一个想法用领域内行话说出来，不该触发。

## 模式表

| 壳子家族 | 常见表面形式 |
|---|---|
| 影响框架 | "探究 X 对 Y 的影响 / the impact/effect of X on Y" |
| 关系框架 | "考察 A 与 B 的关系 / the relationship between A and B" |
| 作用框架 | "理解 X 在 Y 中的作用 / the role of X in Y" |
| 因素框架 | "探讨影响 Y 的因素 / factors influencing Y" |
| 泛泛研究框架 | "关于 X 与 Y 的研究 / a study of X and Y" |
| 知觉/态度调查框架 | "对 X 的知觉/态度 / perceptions/attitudes toward X" |
| 中介/调节模板 | "考察 X 的中介/调节作用 / the mediating/moderating role of X" |
| 有效性框架 | "考察 X 对 Y 的有效性 / the effectiveness of X for Y" |
| 采纳/意向/满意度因素 | "影响采纳/意向/满意度的因素 / factors affecting adoption/intention" |
| 障碍/促进配对 | "X 的障碍与促进因素 / barriers and facilitators to X" |
| 比较研究壳 | "X 与 Y 的比较研究 / a comparative study of X and Y" |
| 框架/模型壳 | "构建 X 的框架/模型 / toward a framework/model for X" |
| 技术增强壳 | "AI/技术在提升 Y 中的作用 / role of AI in enhancing Y"（人机交互题材高发） |
| 体验框架 | "探究 X 在 Y 中的体验 / exploring the experiences of X" |

## 提示话术（命中时用，简短，然后马上回到追问）

> 你这句"<用户原话片段>"听起来有点像一个常见的通用研究问题模板（<家族名>）。不是说想法不好，只是措辞——你领域里的人会用什么更具体的术语、机制、或者张力来说这件事？

举个对比帮用户理解（**只在用户问"那该怎么说"时给**）：
- 套话：「探究拟人化对道德判断的影响」
- 更紧：「当一个 AI 被设计得越像人，人们是更愿意把它当作能承受道德伤害的对象（moral patient），还是更愿意追究它的道德责任（moral agent）？这两者会不会分离？」——后者点明了构念（patiency/agency）、方向、和一个可检验的张力。
