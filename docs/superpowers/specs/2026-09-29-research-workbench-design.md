# AI 研究工作台设计

**目标**：在现有 VitePress 知识库旁增加一个可本地运行的研究工作台，打通论文上传、任务状态、报告归档、idea 对话和结构化导出。

## 范围

- 文献精读工作区：选择 PDF、上传、查看任务状态、查看演示报告、下载 Markdown/JSON、查看知识库条目。
- 研究问题工作区：输入研究想法、获得阶段化反馈、查看当前 idea spec、保存 revision、导出 Markdown/JSON。
- Node 服务端 API：上传、任务、报告、知识库、idea 项目。
- 本地文件存储：上传文件和 JSON/Markdown 输出放在 `data/`，可通过环境变量配置。
- 可替换 skill runner：默认本地演示 runner；真实模型执行通过 `SKILL_RUNNER=...` 和环境变量接入。

## 非范围

- 本阶段不接生产数据库、对象存储、真实账号体系或团队权限。
- 本阶段不实现 OCR、PDF 版式重建或真正的模型调用。
- 本阶段不改变既有教程正文和统计章节。

## 技术设计

VitePress 继续负责文档站。新 Node 服务使用原生 `http`、`fs/promises` 和 `crypto`，避免增加运行时依赖。浏览器端使用原生模块和现有站点视觉变量。服务启动时从 `data/` 读取索引并在写入时使用原子替换，任务状态通过内存队列和 JSON 运行记录保存。

接口：

```text
GET  /api/health
POST /api/uploads
GET  /api/runs/:id
GET  /api/library
GET  /api/reports/:id/download?format=md|json
POST /api/ideas
POST /api/ideas/:id/messages
GET  /api/ideas/:id
GET  /api/ideas/:id/revisions
GET  /research/
```

上传使用 `multipart/form-data`，当前只接受 PDF，大小上限 25 MB。文件名和文本字段由服务端清洗。所有返回值都是 JSON，错误使用 `{ error: { code, message } }`。

## 验收标准

- `npm run build` 通过。
- `npm run server` 能启动服务并返回 `/api/health`。
- 浏览器可以上传一个 PDF，看到 run 状态最终为 `completed`，并能下载 Markdown/JSON。
- 知识库页面显示已完成报告。
- 创建 idea 后发送消息，页面更新阶段和当前 spec，并能查看 revision。
- 服务重启后仍能读取已完成的库条目与 idea。
