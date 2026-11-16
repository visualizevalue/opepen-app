<template>
  <h1>
    <slot />
  </h1>
</template>

<style scoped>
h1 {
  :deep(> small),
  :deep(> span) {
    display: block;
  }

  :deep(> small) {
    color: var(--muted);
    font-family: var(--font-family-brand);
    font-size: var(--label-font-size);
    font-weight: 400;
    letter-spacing: var(--label-letter-spacing);
    text-transform: uppercase;
    margin-bottom: var(--size-2);
  }

  :deep(> span) {
    font-family: var(--font-family-brand);
    text-transform: uppercase;
    font-size: var(--font-xl);
    font-weight: 400;
    letter-spacing: var(--brand-letter-spacing);
    line-height: 1.1;

    @media (--md) {
      font-size: var(--font-xxl);
    }
  }
}
</style>
