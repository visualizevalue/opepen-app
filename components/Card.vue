<template>
  <article class="card">
    <slot />
  </article>
</template>

<style scoped>
.card {
  transform: translateY(0);
  transition: transform var(--speed);

  &:--highlight {
    transform: translateY(-0.5rem);
  }
}
</style>

