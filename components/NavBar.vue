<template>
  <nav>
    <Logo />

    <Button>
      <Icon type="plus" />
      <span>Create</span>
    </Button>
    <Button>jalil.eth</Button>
  </nav>
</template>

<style lang="postcss" scoped>
  nav {
    height: var(--navbar-height);
    padding: var(--size-4);
    display: flex;
    gap: var(--size-3);

    > :first-child {
      margin-right: auto;
    }

    :deep(+ div) {
      height: var(--page-height);
      position: relative;
    }
  }
</style>
