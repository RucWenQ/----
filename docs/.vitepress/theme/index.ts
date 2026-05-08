import { h } from 'vue'
import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import './style.css'

// 自定义组件
import ResourceCard from './components/ResourceCard.vue'
import ResourceGrid from './components/ResourceGrid.vue'
import OutlineCard from './components/OutlineCard.vue'
import ChapterCover from './components/ChapterCover.vue'
import StarRating from './components/StarRating.vue'

export default {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      // 可在这里插入全局 layout slot 内容
    })
  },
  enhanceApp({ app }) {
    // 全局注册组件，所有 .md 文件可直接使用
    app.component('ResourceCard', ResourceCard)
    app.component('ResourceGrid', ResourceGrid)
    app.component('OutlineCard', OutlineCard)
    app.component('ChapterCover', ChapterCover)
    app.component('StarRating', StarRating)
  }
} satisfies Theme
