<template>
  <NuxtLink to="https://ethereum.org" target="_blank" title="Ethereum">
    <img src="/builtoneth.svg" alt="Built on Ethereum" />
  </NuxtLink>
</template>

<style scoped>
/*
 * Sits inline wherever it is placed; the sidebar footer positions it.
 * The artwork is white, so opacity is what sets its grey. 0.383 over the
 * sidebar's #0c0c0c composites to #696969, matching the social icons.
 */
img {
  display: block;
  width: 3.5rem;
  transition: opacity var(--speed);
  opacity: 0.383;

  &:hover {
    opacity: 1;
  }
}
</style>
