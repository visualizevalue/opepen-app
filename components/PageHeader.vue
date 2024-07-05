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

    &:not(.full) {
      max-width: var(--content-width);
      margin: 0 auto;
    }

    :deep(.actions) {
      display: flex;
      gap: var(--size-4);
    }

    :deep(h1) {
      margin: 0;
    }

    @media (--md) {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }

  header.centered {
    text-align: center;
    padding: var(--size-6) 0;
    font-family: var(--font-family-display);
    text-transform: none;

    :deep(h1) {
      font-size: var(--font-title);
      line-height: var(--line-height-md);

      small {
        display: block;
        color: var(--gray-z-6);
        margin: 0 0 var(--size-2);
      }
    }

    :deep(.actions) {
      justify-content: center;
    }
  }
</style>
