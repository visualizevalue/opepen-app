<template>
  <aside>
    <slot />
  </aside>
</template>

<style lang="postcss" scoped>
aside {
  padding: var(--size-4);
  border: var(--border-dark);
  background: var(--gray-z-0);
  border-radius: var(--size-5);
  border-top-left-radius: var(--size-0);
  font-size: var(--font-sm);
  color: var(--gray-z-5);

  &.inline {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--size-4);
  }

  :deep(.button) {
    white-space: nowrap;
  }
}
</style>
