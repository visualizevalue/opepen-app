<template>
  <NuxtLink to="https://ethereum.org" target="_blank" title="Ethereum">
    <img src="/builtoneth.svg" alt="Built on Ethereum" />
  </NuxtLink>
</template>

<style scoped>
/* Sits inline wherever it is placed; the sidebar footer positions it. */
img {
  display: block;
  width: 3.5rem;
  transition: opacity var(--speed);
  opacity: 0.69;

  &:hover {
    opacity: 1;
  }
}
</style>
