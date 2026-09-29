---
title: 研究工作台
description: 文献精读、研究问题打磨与知识库
---

# 研究工作台

这是教程配套的动态研究工具入口：上传论文后生成可归档的精读报告，也可以把一个模糊的研究想法逐步整理成研究问题。

<div class="research-launch">
  <div>
    <span class="research-kicker">RESEARCH STUDIO</span>
    <h2>进入研究工作台</h2>
    <p>工作台服务需要单独启动，默认地址是 <code>http://127.0.0.1:4174/research/</code>。</p>
    <a class="research-button" href="http://127.0.0.1:4174/research/" target="_blank" rel="noreferrer">打开工作台 ↗</a>
  </div>
  <div class="research-scope"><strong>当前版本</strong><span>本地 MVP</span><small>报告和研究想法保存在本机 data/ 目录。真实 skill runner 可在后续接入。</small></div>
</div>

## 两个入口

- **文献精读**：上传 PDF，查看处理状态，下载 Markdown / JSON 报告并进入知识库。
- **研究问题**：从一个现象或困惑开始，记录构念、风险、证据状态和每次修订。

::: warning 使用前
先在项目根目录运行 `npm run server`，再打开上面的工作台地址。当前演示 runner 已打通完整流程，但不会伪造论文内容；真实论文分析需要配置模型与 skill 执行器。
:::
