<template>
<div v-if="percent" class="progress">
  <div :style="{ width: `${percent}%` }"></div>
  <div :style="{ left: `${percent}%`}"><slot/></div>
</div>
</template>

<script setup>
defineProps({
  percent: Number,
})
</script>

<style lang="postcss">
.progress {
  padding: var(--size-0);
  background-color: var(--gray-z-2);
  border-radius: var(--size-1);
  position: relative;

  > div:first-child {
    height: var(--size-1);
    width: var(--size-0);
    background-color: var(--success);
    border-radius: var(--size-0);
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
