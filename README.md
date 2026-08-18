# 速通简明教程

社会心理学方向科研入门手册，基于 VitePress 构建。

## 快速开始

```bash
# 1. 安装依赖（首次）
npm install

# 2. 本地预览（边写边看，热更新）
npm run dev
# → 打开 http://localhost:5173

# 3. 构建静态站点
npm run build
# → 输出在 docs/.vitepress/dist
```

## 项目结构

```
zju-psyc-tutorial/
├── docs/                          ← 所有内容都在这里
│   ├── .vitepress/                ← 配置 + 主题（一般不动）
│   │   ├── config.mts             ← 站点主配置
│   │   ├── sidebar.mts            ← 侧边栏目录（新增章节时改这里）
│   │   └── theme/
│   │       ├── index.ts           ← 主题入口（注册组件）
│   │       ├── style.css          ← 自定义样式（学术米黄+朱砂红）
│   │       └── components/        ← 自定义 Vue 组件
│   ├── public/                    ← 静态资源
│   │   ├── images/                ← 图片
│   │   ├── files/                 ← 可下载的 PDF / 资料
│   │   └── code/                  ← 可下载的示例代码
│   ├── index.md                   ← 首页
│   ├── 0-introduction/            ← 第 0 章
│   ├── 1-tools/                   ← 第 1 章
│   ├── 2-design/                  ← 第 2 章
│   ├── 3-statistics/              ← 第 3 章
│   ├── 4-visualization/           ← 第 4 章
│   ├── 5-methods/                 ← 第 5 章
│   ├── 6-topic/                   ← 第 6 章
│   ├── 7-writing/                 ← 第 7 章
│   └── appendix/                  ← 附录
├── package.json
└── README.md
```

## 添加新内容

详细规范见 `CONTRIBUTING.md`。要点：

1. 文件命名：`kebab-case.md`，例如 `effect-size.md`
2. 每个 `.md` 文件顶部必须有 frontmatter（标题、页面描述）
3. 新增小节后到 `docs/.vitepress/sidebar.mts` 加一行
4. 图片放 `docs/public/images/chapters/{章节文件夹名}/`，引用用绝对路径 `/images/chapters/.../xxx.png`

## 部署

支持 GitHub Pages、Netlify、Vercel、Cloudflare Pages 任意一个静态托管。
构建产物：`docs/.vitepress/dist/`
