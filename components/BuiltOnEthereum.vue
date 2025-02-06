<template>
  <NuxtLink to="https://ethereum.org" target="_blank" title="Ethereum">
    <img src="/builtoneth.svg" alt="Built on Ethereum">
  </NuxtLink>
</template>

<style scoped>
  img {
    position: fixed;
    bottom: var(--spacer);
    right: var(--spacer);
    width: 3.5rem;
    background: var(--semi);
    transition: all var(--speed);
    transform-origin: bottom right;
    box-shadow: var(--shadow);
    opacity: 0.69;

    &:hover {
      transform: scale(1.25);
      box-shadow: var(--shadow-lg);
      opacity: 1;
    }
  }
</style>
