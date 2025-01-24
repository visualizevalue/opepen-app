<template>
  <component :is="tag" class="page-frame-sm">
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
  .page-frame-sm {
    max-width: var(--content-width-sm);
    margin-left: auto;
    margin-right: auto;
    padding: 0;

    @media (--lg) {
      padding: 3cqw 0;
    }
  }
</style>
