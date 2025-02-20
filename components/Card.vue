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

  .card-link {
    border: 0;
  }
}
</style>

