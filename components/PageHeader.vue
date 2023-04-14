<template>
  <header>
    <slot />
  </header>
</template>

<script setup>
</script>

<style lang="postcss" scoped>
  header {
    width: 100%;
    max-width: var(--content-width);
    margin: var(--size-5) auto 0;

    :deep(h1) {
      text-transform: uppercase;
      font-size: var(--size-4);
      font-weight: var(--font-weight-bold);
      letter-spacing: var(--letter-spacing-md);
    }
  }
</style>
