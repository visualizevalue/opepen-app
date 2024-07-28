<template>
  <div class="icon">
    <svg viewBox="247 247 512 512">
      <!-- 1/1 -->
      <rect :fill="c(1)" x="750" y="750" width="50" height="50" transform="rotate(180 750 750)" stroke="white" stroke-width="12"/>
      <!-- 1/4 -->
      <rect :fill="c(4)" x="750" y="700" width="50" height="200" transform="rotate(180 750 700)" stroke="white" stroke-width="12"/>
      <!-- 1/5 -->
      <rect :fill="c(5)" x="700" y="750" width="50" height="250" transform="rotate(180 700 750)" stroke="white" stroke-width="12"/>
      <!-- 1/10 -->
      <rect :fill="c(10)" x="650" y="750" width="150" height="250" transform="rotate(180 650 750)" stroke="white" stroke-width="12"/>
      <!-- 1/20 -->
      <rect :fill="c(20)" width="250" height="250" transform="matrix(1 0 0 -1 250 750)" stroke="white" stroke-width="12"/>
      <!-- 1/40 -->
      <rect :fill="c(40)" x="250" y="250" width="500" height="250" stroke="white" stroke-width="12"/>
    </svg>
  </div>
</template>

<script setup>
const props = defineProps({
  data: Object,
  pendingFill: {
    type: String,
    default: `var(--gray-z-1)`,
  },
})

const c = e => props.data?.submission_stats.demand[e] >= e ? 'var(--gray-z-5)' : props.pendingFill
</script>
