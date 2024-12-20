<template>
  <nav class="tertiary">
    <slot />
  </nav>
</template>

<style lang="postcss" scoped>
nav.tertiary {
  top: calc(var(--navbar-height) + var(--size-4)*2 + var(--size-6) + 1px);
  position: fixed;
  width: calc(var(--size-8) - var(--size-1)*2);
  bottom: var(--navbar-height);
  border-left: var(--border);
  right: 0;
  justify-content: space-evenly;
  align-items: center;
  flex-direction: column;

  > * {
    transform: rotate(-90deg);
    white-space: nowrap;
    padding: var(--size-3) var(--size-4);
    max-width: none;
  }

  @media (--md) {
    top: var(--navbar-height);
    width: var(--sidenav-width);
    justify-content: center;
    align-items: flex-end;
    bottom: 0;
    border-left: none;

    > * {
      transform: none;
      flex-direction: row-reverse;
      padding: var(--size-2) var(--size-6);
      max-width: 100%;
    }
  }
}
</style>
