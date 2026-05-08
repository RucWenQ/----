<script setup lang="ts">
/**
 * 星级评分（1–5）
 * 
 * 用法：
 * <StarRating :score="4" /> → ★★★★☆
 * <StarRating :score="3" :max="5" />
 */
const props = withDefaults(
  defineProps<{
    score: number
    max?: number
  }>(),
  { max: 5 }
)
</script>

<template>
  <span class="star-rating" :title="`${score}/${max}`">
    <span class="star filled" v-for="i in score" :key="`f-${i}`">★</span>
    <span class="star empty" v-for="i in max - score" :key="`e-${i}`">☆</span>
  </span>
</template>

<style scoped>
.star-rating {
  display: inline-flex;
  gap: 1px;
  letter-spacing: 0;
}
.star.filled { color: var(--tutorial-accent); }
.star.empty { color: var(--vp-c-text-3); opacity: 0.5; }
</style>
