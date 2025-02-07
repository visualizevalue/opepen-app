<template>
  <h1>
    <slot />
  </h1>
</template>

<style scoped>
h1 {
  :deep(> small),
  :deep(> span) {
    @mixin ui-font;
    display: block;
  }

  :deep(> small) {
    color: var(--gray-z-6);
    margin-bottom: var(--size-2);
  }

  :deep(> span) {
    font-size: var(--font-xl);
    line-height: 0.8;
    margin-left: -0.05em;

    @media (--md) {
      font-size: var(--font-xxl);
    }
  }
}
</style>
