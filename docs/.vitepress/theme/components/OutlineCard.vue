<script setup lang="ts">
/**
 * 章节内的"路线图"卡片
 * 
 * 用法：
 * <OutlineCard title="本节路线图">
 * 
 * - 第一步内容
 * - 第二步内容
 * 
 * </OutlineCard>
 */
defineProps<{
  title?: string
}>()
</script>

<template>
  <div class="outline-card">
    <h4 v-if="title" class="oc-title">{{ title }}</h4>
    <div class="oc-body">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.outline-card {
  border: 1px solid var(--vp-c-border);
  background: var(--vp-c-bg-alt);
  border-radius: 6px;
  padding: 18px 22px;
  margin: 22px 0;
}

.oc-title {
  font-family: 'Fraunces', 'Noto Serif SC', serif;
  font-style: italic;
  font-weight: 500;
  font-size: 15px;
  color: var(--tutorial-accent);
  margin: 0 0 10px;
  padding-bottom: 8px;
  border-bottom: 1px dashed var(--vp-c-divider);
}

.oc-body :deep(ul) {
  margin: 0;
  padding-left: 20px;
}

.oc-body :deep(ul li) {
  margin: 6px 0;
}

.oc-body :deep(p:last-child) {
  margin-bottom: 0;
}
</style>
