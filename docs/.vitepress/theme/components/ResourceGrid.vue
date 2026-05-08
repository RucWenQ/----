<script setup lang="ts">
/**
 * 资源卡片网格容器
 * 
 * 用法：
 * <ResourceGrid>
 *   <ResourceCard ... />
 *   <ResourceCard ... />
 * </ResourceGrid>
 * 
 * 或自定义列数：
 * <ResourceGrid :cols="3" :min="180">
 */
defineProps<{
  cols?: number
  min?: number
}>()
</script>

<template>
  <div
    class="resource-grid"
    :style="{
      gridTemplateColumns: cols
        ? `repeat(${cols}, 1fr)`
        : `repeat(auto-fit, minmax(${min || 200}px, 1fr))`
    }"
  >
    <slot />
  </div>
</template>

<style scoped>
.resource-grid {
  display: grid;
  gap: 10px;
  margin: 18px 0;
}

@media (max-width: 640px) {
  .resource-grid {
    grid-template-columns: 1fr !important;
  }
}
</style>
