<template>
  <nav :class="{ 'scrolled': isScrolled }">
    <NuxtLink to="/">
      <Logo />
    </NuxtLink>

    <Button to="/create" @click="onCreateClick">
      <Icon type="plus" />
      <span>Create</span>
    </Button>
    <Connect />
  </nav>
</template>

<script setup>
import { useWindowScroll } from '@vueuse/core'

const { y } = useWindowScroll()

const isScrolled = computed(() => y.value > 5)

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
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: var(--navbar-height);
    padding: var(--size-4);
    display: flex;
    gap: var(--size-3);
    background-color: var(--semi);
    z-index: 200;
    border-bottom: var(--border);
    border-color: transparent;
    backdrop-filter: blur(var(--size-1));
    transition: all var(--speed-fast);

    &.scrolled {
      border-color: var(--gray-z-2);
    }

    > :first-child {
      margin-right: auto;
    }

    :deep(+ div) {
      position: relative;
      min-height: var(--100vh);
      padding: calc(var(--navbar-height) + var(--size-4)) var(--size-4) var(--size-5);
    }
  }
</style>
