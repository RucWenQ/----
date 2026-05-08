<script setup lang="ts">
/**
 * 资源链接卡片
 * 
 * 用法：
 * <ResourceCard 
 *   name="Web of Science"
 *   desc="综合检索 · 引文分析"
 *   href="https://example.com"
 *   icon="🔍"
 * />
 */
defineProps<{
  name: string
  desc?: string
  href: string
  icon?: string
}>()
</script>

<template>
  <a class="rc" :href="href" target="_blank" rel="noopener">
    <div class="rc-icon" v-if="icon">{{ icon }}</div>
    <div class="rc-body">
      <div class="rc-name">{{ name }}</div>
      <div class="rc-desc" v-if="desc">{{ desc }}</div>
    </div>
    <div class="rc-arrow">→</div>
  </a>
</template>

<style scoped>
.rc {
  display: flex;
  align-items: center;
  gap: 12px;
  border: 1px solid var(--vp-c-border);
  background: var(--vp-c-bg-alt);
  padding: 12px 14px;
  border-radius: 6px;
  text-decoration: none !important;
  color: var(--vp-c-text-1) !important;
  transition: all 0.15s ease;
  font-weight: normal;
}

.rc:hover {
  border-color: var(--tutorial-accent);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(166, 50, 31, 0.08);
}

.rc-icon {
  font-size: 20px;
  flex-shrink: 0;
}

.rc-body {
  flex: 1;
  min-width: 0;
}

.rc-name {
  font-weight: 600;
  font-size: 14px;
  margin-bottom: 2px;
}

.rc-desc {
  font-size: 12.5px;
  color: var(--vp-c-text-3);
  line-height: 1.4;
}

.rc-arrow {
  color: var(--vp-c-text-3);
  font-size: 14px;
  transition: all 0.15s;
}

.rc:hover .rc-arrow {
  color: var(--tutorial-accent);
  transform: translateX(2px);
}
</style>
