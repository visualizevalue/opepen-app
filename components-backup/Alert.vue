<template>
  <aside>
    <slot />
  </aside>
</template>

<style scoped>
aside {
  padding: var(--size-4);
  border: var(--border-dark);
  background: var(--gray-z-0);
  border-radius: var(--size-5);
  border-top-left-radius: var(--size-0);
  font-size: var(--font-sm);
  color: var(--gray-z-5);
  line-height: var(--line-height-md);
  position: relative;

  &.inline {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--size-4);
  }

  :deep(.button) {
    white-space: nowrap;
  }

  &.info {
    background-color: var(--blue-9);
    color: var(--blue-1);
  }
}
</style>
