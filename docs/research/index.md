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
    <p>工作台运行在服务器上，直接打开即可使用，无需在本地启动服务。</p>
    <a class="research-button" href="https://mdwx.com.cn/research/" target="_self">打开工作台 →</a>
  </div>
  <div class="research-scope"><strong>当前版本</strong><span>真实模型工作台</span><small>报告和研究想法保存在服务端 data/ 目录。模型由服务端环境变量配置。</small></div>
</div>

## 两个入口

- **文献精读**：上传 PDF，查看处理状态，下载 Markdown / JSON 报告并进入知识库。
- **研究问题**：从一个现象或困惑开始，记录构念、风险、证据状态和每次修订。

::: warning 使用前
服务器默认使用 Qwen。部署环境配置 `LLM_PROVIDER=qwen` 和 `QWEN_API_KEY` 后，论文上传会调用真实模型并归档结构化报告；切换 DeepSeek 时改用 `LLM_PROVIDER=deepseek` 和 `DEEPSEEK_API_KEY`。若未配置对应 key，健康接口会明确报告模型未配置。
:::
