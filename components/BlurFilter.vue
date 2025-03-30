<template>
  <svg width="0" height="0">
    <filter :id="id" y="-100%" x="-100%" width="300%" height="300%">
      <feGaussianBlur in="SourceGraphic" :stdDeviation="stdDeviation" result="blurred" />
      <feColorMatrix type="saturate" in="blurred" :values="saturate" result="saturated" />
      <feComponentTransfer in="saturated" result="transparent">
        <feFuncA type="linear" :slope="opacity" />
      </feComponentTransfer>
      <feComposite in="SourceGraphic" in2="transparent" operator="over" />
    </filter>
  </svg>
</template>

<script setup>
defineProps({
  id: {
    type: String,
    default: 'blur-and-scale',
  },
  stdDeviation: {
    type: Number,
    default: 100,
  },
  saturate: {
    type: Number,
    default: 1.5,
  },
  opacity: {
    type: Number,
    default: 0.5,
  },
})
</script>

<style scoped>
svg {
  position: absolute;
}
</style>
