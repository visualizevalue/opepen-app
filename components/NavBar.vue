<template>
  <nav>
    <NuxtLink to="/">
      <Logo />
    </NuxtLink>

    <Button to="/create" @click="onCreateClick">
      <Icon type="plus" />
      <span>Create</span>
    </Button>
    <!-- <Button>jalil.eth</Button> -->
  </nav>
</template>

<script setup>
const onCreateClick = () => {
  setTimeout(() => {
    nextTick(() => {
      const el = document.querySelector('.prompt-input textarea')

      el?.focus()
    })
  }, 50)
}
</script>

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
