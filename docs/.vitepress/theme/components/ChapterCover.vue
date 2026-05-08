<script setup lang="ts">
/**
 * 章节封面（用于章节首页或大节开头）
 * 
 * 用法：
 * <ChapterCover 
 *   meta="CHAPTER 1 — TOOLS" 
 *   title="科研工具" 
 *   quote="工具决定了你能问出什么样的问题。"
 * />
 */
defineProps<{
  meta?: string
  title: string
  quote?: string
}>()
</script>

<template>
  <div class="chap-cover">
    <div class="meta" v-if="meta">{{ meta }}</div>
    <h2 class="title">{{ title }}</h2>
    <div class="quote" v-if="quote">"{{ quote }}"</div>
  </div>
</template>

<style scoped>
.chap-cover {
  border-top: 2px solid var(--tutorial-accent);
  border-bottom: 1px solid var(--vp-c-divider);
  padding: 36px 0 28px;
  margin: 12px 0 32px;
}

.meta {
  font-family: 'Fraunces', serif;
  font-style: italic;
  font-size: 13px;
  color: var(--tutorial-accent);
  letter-spacing: 0.1em;
  text-transform: uppercase;
  margin-bottom: 8px;
}

.title {
  font-family: 'Fraunces', 'Noto Serif SC', serif;
  font-size: 38px;
  font-weight: 500;
  margin: 0 0 8px;
  letter-spacing: -0.015em;
  line-height: 1.15;
}

.quote {
  color: var(--vp-c-text-3);
  font-family: 'Fraunces', serif;
  font-style: italic;
  font-size: 16px;
  margin-top: 12px;
}

@media (max-width: 640px) {
  .title { font-size: 28px; }
}
</style>
