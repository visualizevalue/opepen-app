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
    display: grid;
    gap: var(--spacer-lg);
    margin-left: auto;
    margin-right: auto;

    @media (--md) {
      max-width: var(--content-width-sm);
    }

    &.prose {
      gap: 0;
    }
  }
</style>
