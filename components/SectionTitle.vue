<template>
  <h1>
    <slot />
  </h1>
</template>

<style scoped>
h1 {
  display: flex;
  align-items: center;
  gap: var(--spacer-sm);
  @mixin ui-font;
  color: var(--gray-z-6);

  &.small {
    font-size: var(--font-base);
  }
}
</style>
