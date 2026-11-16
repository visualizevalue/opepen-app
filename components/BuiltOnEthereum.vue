<template>
  <NuxtLink to="https://ethereum.org" target="_blank" title="Ethereum">
    <img src="/builtoneth.svg" alt="Built on Ethereum" />
  </NuxtLink>
</template>

<style scoped>
/*
 * Sits inline wherever it is placed; the sidebar footer positions it.
 * The artwork is white, so opacity is what sets its grey: 0.53 lands near
 * the social icons' #8e8e93 on the sidebar.
 */
img {
  display: block;
  width: 3.25rem;
  transition: opacity var(--speed);
  opacity: 0.53;

  &:hover {
    opacity: 1;
  }
}
</style>
