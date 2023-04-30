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
  font-family: var(--font-family-display);
  height: var(--size-7);
  background: var(--gray-z-3);
  color: var(--gray-z-8);
  padding: calc(var(--size-0) + var(--size-2)) var(--size-4);
  transition: background var(--speed), color var(--speed);
  user-select: none;
  border-radius: var(--size-4);
  border-top-left-radius: var(--size-1);
  border: var(--border);

  &:--highlight,
  &.active {
    background: var(--gray-z-4);
    color: var(--color);
  }

  &.link.router-link-exact-active,
  &.link.active {
    background: var(--gray-z-4);
  }

  &[disabled]:not([disabled=false]) {
    pointer-events: none;
    color: var(--gray-z-5);
    cursor: normal;
  }
}
</style>

<style lang="postcss">
.button,
button {
  display: flex;
  gap: var(--size-2);
  justify-content: center;
  align-items: center;
  text-align: center;
  outline: none;
  font-size: var(--font-sm);
  font-weight: var(--font-weight-bold);
  letter-spacing: var(--letter-spacing-md);
  line-height: 1;
  text-transform: uppercase;
  color: var(--gray-z-6);

  .vue-feather,
  .icon {
    color: var(--gray-z-5);
    width: var(--size-4);
    height: var(--size-4);

    &:first-child {
      margin-left: calc(-1 * var(--size-1));
    }
  }

  &:--highlight {
    outline: none;
    color: var(--color);

    .vue-feather,
    .icon {
      color: var(--gray-z-8);
    }
  }

  &[disabled]:not([disabled=false]) {
    pointer-events: none;
    cursor: normal;
  }

  &.muted {
    color: var(--gray-z-6);
  }
}
</style>
