<template>
  <button class="handle" tabindex="-1">
    <Icon type="more-vertical" />
  </button>
</template>

<style lang="postcss" scoped>
.handle {
  padding: var(--size-1) var(--size-0);
  border: var(--border);
  border-radius: var(--size-2);
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--gray-z-2);

  > * {
    margin: 0 !important;
  }
}
</style>
