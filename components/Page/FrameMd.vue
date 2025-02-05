<template>
  <component :is="tag" class="page-frame-md">
    <slot />
  </component>
</template>

<script setup>
defineProps({
  tag: {
    type: String,
    default: 'article',
  },
})
</script>

<style scoped>
  .page-frame-md {
    display: grid;
    gap: var(--spacer-lg);
    margin-left: auto;
    margin-right: auto;
    max-width: var(--content-width);
  }
</style>
