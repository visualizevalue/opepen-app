<template>
  <NuxtLink v-if="to" :to="to" class="button" :exact="exact"><slot /></NuxtLink>
  <button v-else class="button"><slot /></button>
</template>

<script setup>
const { to, exact, gridAligned } = defineProps({
  to: String,
  exact: Boolean,
})
</script>

<style lang="postcss" scoped>
.button,
button {
  display: flex;
  gap: var(--size-1);
  justify-content: center;
  align-items: center;
  text-align: center;
  text-transform: uppercase;
  height: var(--size-7);
  background: var(--gray-z-3);
  color: var(--gray-z-8);
  padding: var(--size-3) var(--size-4);
  transition: background var(--speed), color var(--speed);
  user-select: none;
  border-radius: var(--size-4);
  border-top-left-radius: var(--size-1);
  font-size: var(--font-sm);
  font-weight: bold;
  letter-spacing: var(--letter-spacing-md);
  line-height: 1;

  &:--highlight,
  &.active {
    outline: none;
    background: var(--gray-z-4);
    color: var(--color);
  }

  &.router-link-exact-active,
  &.active {
    background: var(--gray-z-5);
  }

  &[disabled]:not([disabled=false]) {
    pointer-events: none;
    color: var(--gray-z-3);
    cursor: normal;
  }
}
</style>

<style lang="postcss">
button {
  outline: none;

  &:--highlight {
    outline: none;
  }

  &[disabled]:not([disabled=false]) {
    pointer-events: none;
    cursor: normal;
  }

  .vue-feather,
  .icon {
    color: var(--gray-z-5);

    &:first-child {
      margin-left: calc(-1 * var(--size-1));
    }
  }
}
</style>
