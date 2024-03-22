<template>
  <NuxtLink v-if="to" :to="to" class="button" :exact="exact" :target="target"><slot /></NuxtLink>
  <button v-else class="button"><slot /></button>
</template>

<script setup>
const { to, exact, gridAligned } = defineProps({
  to: String,
  target: {
    type: String,
    default: '_self',
  },
  exact: Boolean,
})
</script>

<style lang="postcss" scoped>
.button,
button {
  height: var(--size-7);
  background: var(--gray-z-3);
  color: var(--gray-z-8);
  padding: calc(var(--size-0) + var(--size-2)) var(--size-4);
  transition: background var(--speed), color var(--speed);
  user-select: none;
  border-radius: var(--size-5);
  border-top-left-radius: var(--size-1);
  border: var(--border);
  position: relative;

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

  &.small {
    font-size: var(--font-sm);
    padding: var(--size-2) var(--size-3);
  }

  @media (--md) {
    padding: calc(var(--size-1) + var(--size-2)) var(--size-4);
    height: calc(var(--size-7) + var(--size-1));

    &.small {
      font-size: var(--font-sm);
      padding: var(--size-2) var(--size-3);
      height: calc(var(--size-6) + var(--size-1));
    }
  }

  &.secondary {
    background-color: var(--gray-z-1);
    border-color: var(--gray-z-2);
    color: var(--gray-z-6);

    &:--highlight,
    &.active {
      background: var(--gray-z-3);
      border-color: var(--gray-z-3);
      color: var(--color);
    }
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
    overflow: visible;
    color: var(--gray-z-5);
    width: var(--size-4);
    height: var(--size-4);
    transition: all var(--speed);

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

  > span {
    > small {
      color: var(--gray-z-6);
    }
  }
}

.hidden-action {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  height: 100%;
  width: 100%;
  z-index: 100;

  span {
    opacity: 0;
  }
}
</style>
