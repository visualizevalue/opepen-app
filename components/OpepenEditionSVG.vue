<template>
  <svg viewBox="0 0 206 206">
    <rect x="178" y="183" width="25"  height="20"  stroke="currentColor" :fill="edition === 1 ? 'currentColor' : 'none'" :stroke-width="stroke"/>
    <rect x="178" y="103" width="25"  height="80"  stroke="currentColor" :fill="edition === 4 ? 'currentColor' : 'none'" :stroke-width="stroke"/>
    <rect x="153" y="103" width="25"  height="100" stroke="currentColor" :fill="edition === 5 ? 'currentColor' : 'none'" :stroke-width="stroke"/>
    <rect x="103" y="103" width="50"  height="100" stroke="currentColor" :fill="edition === 10 ? 'currentColor' : 'none'" :stroke-width="stroke"/>
    <rect x="3"   y="103" width="100" height="100" stroke="currentColor" :fill="edition === 20 ? 'currentColor' : 'none'" :stroke-width="stroke"/>
    <rect x="3"   y="3"   width="200" height="100" stroke="currentColor" :fill="edition === 40 ? 'currentColor' : 'none'" :stroke-width="stroke"/>
  </svg>
</template>

<script setup>
defineProps({
  edition: Number,
  stroke: {
    type: Number,
    default: 5,
  },
})
</script>
