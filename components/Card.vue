<template>
  <article class="card">
    <slot />
  </article>
</template>

<style scoped>
.card {
  transform: translateY(0);
  transition: all var(--speed);
  display: grid;
  gap: var(--spacer-sm);

  &:--highlight {
    &:not(.static) {
      transform: translateY(-0.5rem);
    }
  }

  &:not(.borderless) {
    background-color: var(--gray-z-1);

    &:--highlight {
      &:not(.static) {
        background-color: var(--gray-z-2);
      }
    }
  }

  :deep(> h1:not(:last-child)),
  :deep(> header:not(:last-child)) {
    border-bottom: var(--border);
    padding-bottom: calc(var(--spacer) - var(--spacer-xs));
  }

  :deep(> h1:not(:first-child)),
  :deep(> header:not(:first-child)) {
    padding-top: calc(var(--spacer) - var(--spacer-xs));
  }

  :deep(> header) {
    display: flex;
    align-items: baseline;
    justify-content: space-between;

    > *:last-child:not(:first-child) {
      @mixin ui-font;
      color: var(--gray-z-4);
    }
  }

  .card-link {
    border: 0;
  }
}
</style>

