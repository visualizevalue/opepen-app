<template>
  <nav class="secondary">
    <slot />
  </nav>
</template>

<style scoped>
nav.secondary {
  border-bottom: var(--border);
  position: fixed;
  top: var(--navbar-height);

  @media (--md) {
    border-bottom: 0;
    left: 0;
  }
}
</style>
