<template>
  <nav>
    <Logo />

    <Button>
      <Icon type="plus" size="1rem" />
      <span>Create</span>
    </Button>
    <Button>jalil.eth</Button>
  </nav>
</template>

<style lang="postcss" scoped>
  nav {
    padding: var(--size-4);
    display: flex;
    gap: var(--size-3);

    > :first-child {
      margin-right: auto;
    }
  }
</style>
