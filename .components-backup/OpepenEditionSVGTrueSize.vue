<template>
  <svg viewBox="0 0 10 12">
    <rect x="8" y="10" width="1" height="1" stroke="currentColor" :fill="edition === 1 ? 'currentColor' : 'none'" stroke-width="0.1"/>
    <rect x="8" y="6"  width="1" height="4" stroke="currentColor" :fill="edition === 4 ? 'currentColor' : 'none'" stroke-width="0.1"/>
    <rect x="7" y="6"  width="1" height="5" stroke="currentColor" :fill="edition === 5 ? 'currentColor' : 'none'" stroke-width="0.1"/>
    <rect x="5" y="6"  width="2" height="5" stroke="currentColor" :fill="edition === 10 ? 'currentColor' : 'none'" stroke-width="0.1"/>
    <rect x="1" y="6"  width="4" height="5" stroke="currentColor" :fill="edition === 20 ? 'currentColor' : 'none'" stroke-width="0.1"/>
    <rect x="1" y="1"  width="8" height="5" stroke="currentColor" :fill="edition === 40 ? 'currentColor' : 'none'" stroke-width="0.1"/>
  </svg>
</template>

<script setup>
defineProps({
  edition: Number,
})
</script>
