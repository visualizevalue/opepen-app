<template>
<div class="progress">
  <div :style="{ width: `${percent}%` }"></div>
  <div :style="{ left: `${percent}%`}"><slot/></div>
</div>
</template>

<script setup>
defineProps({
  percent: {
    type: Number,
    default: 0,
  },
})
</script>

<style scoped>
.progress {
  padding: 0;
  background-color: var(--gray-z-2);
  border-radius: var(--size-1);
  position: relative;
  @mixin ui-font;

  > div:first-child {
    height: var(--size-1);
    width: var(--size-0);
    background-color: var(--success);
    border-radius: var(--size-0);
    transition: width var(--speed);
  }

  > div:last-child {
    font-size: var(--font-sm);
    color: var(--gray-z-6);
    position: absolute;
    top: var(--size-2);
    left: auto;
    text-align: center;
    width: 20rem;
    margin-left: -9.7rem;
  }
}
</style>
