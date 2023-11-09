<template>
  <h1><slot /> <Icon type="chevron-right" /></h1>
</template>

<style lang="postcss" scoped>
h1 {
  display: flex;
  align-items: center;
  font-size: var(--font-lg);
  margin: var(--size-4) 0;

  .icon {
    color: var(--gray-z-6);
  }
}
</style>
