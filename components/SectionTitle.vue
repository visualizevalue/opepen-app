<template>
  <h1><slot /> <Icon type="chevron-right" /></h1>
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

  .icon {
    color: var(--gray-z-4);
    width: var(--size-4);
    height: var(--size-4);
    margin-left: var(--size-2);
    margin-top: -0.1em;
  }
}
</style>
