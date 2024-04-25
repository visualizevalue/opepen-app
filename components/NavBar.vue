<template>
  <nav :class="{ 'scrolled': isScrolled }">
    <NuxtLink to="/" title="Opepen Home Page" class="to-home">
      <Logo />
    </NuxtLink>

    <!-- <Button to="/auctions">
      <Icon type="columns" />
      <span>Auctions</span>
    </Button> -->

    <Button to="/artists" class="right">
      <Icon type="users" />
      <span>Community</span>
    </Button>
    <Button to="/sets">
      <Icon type="grid" />
      <span>Sets</span>
    </Button>
    <Button to="/sets/explore">
      <Icon type="table" />
      <span>Submissions</span>
    </Button>

    <CreateLink />

    <Connect />
  </nav>
</template>

<script setup>
import { useWindowScroll } from '@vueuse/core'

const { y } = useWindowScroll()

const isScrolled = computed(() => y.value > 5)
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
    align-items: center;
    gap: var(--size-3);
    z-index: 40;
    transition: all var(--speed-fast);
    background-color: transparent;
    border-bottom: var(--border);
    border-color: transparent;

    &:not(.minimal) {
      background-color: var(--semi);
      backdrop-filter: var(--blur);
    }

    &.minimal {
      > .to-home {
        display: none;
      }
    }

    &.scrolled:not(.minimal) {
      border-color: var(--gray-z-4);
    }

    :deep(> *) {
      height: var(--size-7);

      @media (--sm) {
        height: calc(var(--size-7) + var(--size-1));
      }
    }

    > .to-home {
      margin-right: auto;
      display: flex;
      align-items: center;

      :deep(.text) {
        display: none;

        @media (--lg) {
          display: initial;
        }
      }
    }

    > .right {
      margin-left: auto;
    }

    :deep(+ div) {
      position: relative;
      min-height: var(--100vh);
      padding: calc(var(--navbar-height) + var(--size-4)) var(--container-padding-x) var(--size-5);
    }

    :deep(> .button:not(:last-child)) {
      > span {
        display: none;

        @media (--lg) {
          display: block;
        }
      }
    }
  }
</style>
