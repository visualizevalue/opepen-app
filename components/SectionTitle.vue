<template>
  <h1>
    <slot />
  </h1>
</template>

<style scoped>
/* Headline: the title of a card or a block within a page. */
h1 {
  display: flex;
  align-items: center;
  gap: var(--spacer-sm);
  font-size: 1.0625rem;
  font-weight: var(--font-weight-bold);
  letter-spacing: var(--letter-spacing-sm);
  line-height: var(--ui-line-height);
  color: var(--color);

  &.small {
    font-size: var(--font-base);
  }
}
</style>
