<template>
  <component :is="tag" class="page-frame-lg">
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
.page-frame-lg {
  container-type: inline-size;
  container-name: page;
  display: grid;
  gap: var(--spacer);
  margin-left: auto;
  margin-right: auto;
  max-width: var(--content-width-wide);

  @media (--md) {
    gap: var(--spacer-lg);
    padding: var(--spacer) var(--spacer-lg);
  }
}
</style>
