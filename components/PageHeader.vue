<template>
  <header>
    <slot />
  </header>
</template>

<style scoped>
  header {
    width: 100%;
    min-height: var(--size-7);
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;

    :deep(.actions) {
      display: flex;
      gap: var(--spacer);

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
