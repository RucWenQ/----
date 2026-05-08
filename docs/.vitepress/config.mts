import { defineConfig } from "vitepress";
import { sidebar } from "./sidebar.mts";
import mathjax3 from "markdown-it-mathjax3";

export default defineConfig({
  // 站点基本信息
  title: "明德惟心",
  titleTemplate: ":title · 速通简明教程",
  description: "社会心理学方向科研入门手册：从工具到论文。",
  lang: "zh-CN",

  // 部署到子路径时改这里，例如 GitHub Pages 仓库名为 my-tutorial 则为 '/my-tutorial/'
  base: "/",

  // 性能与体验
  cleanUrls: true,
  lastUpdated: true,
  metaChunk: true,

  head: [
    [
      "link",
      { rel: "icon", type: "image/svg+xml", href: "/icons/gemini-svg.svg" },
    ],
    ["meta", { name: "theme-color", content: "#A6321F" }],
  ],

  // Markdown 配置
  markdown: {
    lineNumbers: false,
    math: true,
    image: { lazyLoading: true },
    container: {
      tipLabel: "提示",
      warningLabel: "注意",
      dangerLabel: "警告",
      infoLabel: "信息",
      detailsLabel: "展开",
    },
    config: (md) => {
      md.use(mathjax3);
    },
  },

  themeConfig: {
    siteTitle: "简明教程",
    logo: "/icons/gemini-svg.svg",

    // 顶部导航
    nav: [
      { text: "首页", link: "/" },
      { text: "引言", link: "/0-introduction/" },
      {
        text: "工具与方法",
        items: [
          { text: "科研工具", link: "/1-tools/" },
          { text: "研究方法", link: "/5-methods/" },
        ],
      },
      {
        text: "统计与作图",
        items: [
          { text: "统计", link: "/3-statistics/" },
          { text: "科研作图", link: "/4-visualization/" },
        ],
      },
      {
        text: "选题与写作",
        items: [
          { text: "选题", link: "/6-topic/" },
          { text: "研究设计", link: "/2-design/" },
          { text: "论文写作", link: "/7-writing/" },
        ],
      },
      { text: "附录", link: "/appendix/" },
    ],

    // 侧边栏（从单独文件导入，便于维护）
    sidebar,

    // 右侧 outline
    outline: {
      level: [2, 3],
      label: "本页内容",
    },

    // 文末上一页 / 下一页
    docFooter: {
      prev: "上一页",
      next: "下一页",
    },

    // 最后更新时间显示格式
    lastUpdated: {
      text: "最后更新",
      formatOptions: {
        dateStyle: "medium",
        timeStyle: undefined,
      },
    },

    // 本地搜索
    search: {
      provider: "local",
      options: {
        locales: {
          root: {
            translations: {
              button: { buttonText: "搜索文档", buttonAriaLabel: "搜索" },
              modal: {
                noResultsText: "没有找到相关结果",
                resetButtonTitle: "清除",
                footer: {
                  selectText: "选择",
                  navigateText: "切换",
                  closeText: "关闭",
                },
              },
            },
          },
        },
      },
    },

    // 编辑链接（推到 GitHub 后启用，先注释）
    // editLink: {
    //   pattern: 'https://github.com/your-name/zju-psyc-tutorial/edit/main/docs/:path',
    //   text: '在 GitHub 上编辑此页'
    // },

    socialLinks: [
      // { icon: 'github', link: 'https://github.com/your-name/zju-psyc-tutorial' }
    ],

    footer: {
      copyright: "©明德惟心 · 速通简明教程",
    },

    // 暗色模式切换文本
    darkModeSwitchLabel: "主题",
    sidebarMenuLabel: "目录",
    returnToTopLabel: "回到顶部",
    langMenuLabel: "语言",
  },

  // SSR 兼容性
  vite: {
    ssr: {
      noExternal: ["mathjax-full"],
    },
  },
});
