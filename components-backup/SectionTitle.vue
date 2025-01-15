<template>
  <h1><slot /> <Icon type="chevron-right" /></h1>
</template>

<style scoped>
h1 {
  display: flex;
  align-items: center;
  font-size: var(--font-base);
  margin: var(--size-6) 0;

  &:first-child {
    margin-top: 0;
  }

  .icon {
    color: var(--gray-z-6);
    width: var(--size-5);
    height: var(--size-5);
    margin-left: var(--size-2);
  }
}
</style>
