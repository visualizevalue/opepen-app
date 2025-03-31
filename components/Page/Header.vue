<template>
  <header class="page-header">
    <slot />
  </header>
</template>

<style scoped>
header.page-header {
  width: 100%;
  min-height: calc(var(--size-7) + var(--size-3));
  display: flex;
  gap: var(--spacer);
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;

  :deep(.actions) {
    margin-left: auto;
    display: flex;
    gap: var(--spacer);
    justify-content: flex-end;

    > label {
      @mixin ui-font;
      display: flex;
      flex-wrap: nowrap;
      align-items: center;
      gap: var(--spacer-sm);
      color: var(--muted);
      width: min-content;
      flex-shrink: 0;
    }
  }

  &:has(svg.opepen-edition) {
    display: grid;
    align-items: center;
    grid-template-columns: 1fr var(--size-8);
    position: relative;

    :deep(> *:not(svg):first-child) {
      grid-row: 1;
      grid-column: 1;
    }

    :deep(> svg) {
      font-size: var(--font-xl);
      width: 0.75em;
      width: 1em;
      grid-row: 1;
      grid-column: 2;
      justify-self: flex-end;
      align-self: flex-start;
      margin-top: var(--spacer-sm);

      @media (--md) {
        font-size: var(--font-xxl);
      }
    }
  }
}
</style>
