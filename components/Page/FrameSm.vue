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
  container-type: inline-size;
  container-name: page;
  display: grid;
  gap: var(--spacer);
  margin-left: auto;
  margin-right: auto;

  @media (--md) {
    max-width: var(--content-width-sm);
    gap: var(--spacer-lg);
  }

  &.prose {
    gap: 0;
    padding-top: var(--spacer-lg);
    padding-bottom: var(--spacer-lg);
  }
}
</style>
