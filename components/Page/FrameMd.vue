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
    max-width: var(--content-width);
    margin-left: auto;
    margin-right: auto;
    padding: 0;
  }
</style>
