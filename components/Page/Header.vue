<template>
  <header>
    <slot />
  </header>
</template>

<style scoped>
  header {
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
  }
</style>
