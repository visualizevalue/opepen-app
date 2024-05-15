<template>
  <nav class="main" :class="{ 'scrolled': isScrolled }">
    <NuxtLink to="/" title="Opepen Home Page" class="home">
      <Logo />
    </NuxtLink>

    <Button to="/create/sets">
      <Icon type="plus" />
      <span>Create</span>
    </Button>

    <Connect />
  </nav>

  <nav class="links">

    <NuxtLink to="/home" title="Home" @click="toTop">
      <Icon type="home" />
      <span>Feed</span>
    </NuxtLink>

    <!-- <NuxtLink to="/auctions" title="Auctions">
      <Icon type="columns" />
      <span>Auctions</span>
    </NuxtLink> -->

    <NuxtLink to="/sets/permanent-collection" title="Sets">
      <Icon type="grid" />
      <span>Sets</span>
    </NuxtLink>

    <NuxtLink to="/artists" title="Nodes">
      <Icon type="users" />
      <span>Nodes</span>
    </NuxtLink>

    <Authenticated>
      <template #default="{ isConnected }">
        <NuxtLink v-if="isConnected" to="/settings" title="Settings" class="visible-md">
          <Icon type="settings" />
          <span>Settings</span>
        </NuxtLink>
      </template>
    </Authenticated>
  </nav>
</template>

<script setup>
import { useWindowScroll } from '@vueuse/core'

const { y } = useWindowScroll()

const isScrolled = computed(() => y.value > 5)

const toTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  })
}
</script>

<style lang="postcss" scoped>
  nav {
    position: fixed;
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
    border-color: transparent;
    background-color: var(--semi);
    backdrop-filter: var(--blur);

    @media (--max-md) {
      border-color: var(--gray-z-4);
    }

    :deep(> *) {
      height: var(--size-7);

      @media (--md) {
        height: calc(var(--size-7) + var(--size-1));
      }
    }

    /* Default Page Padding */
    :deep(+ div) {
      position: relative;
      min-height: var(--100vh);
      padding: calc(var(--navbar-height) + var(--size-4)) var(--container-padding-x) calc(var(--navbar-height) + env(safe-area-inset-bottom));

      &.full {
        padding: var(--navbar-height) 0 calc(var(--navbar-height) + env(safe-area-inset-bottom));
      }
    }
  }

  nav.main {
    top: 0;
    border-bottom: var(--border);

    &.scrolled {
      border-color: var(--gray-z-4);
      background-color: var(--semi);
      backdrop-filter: var(--blur);
    }


    > .home {
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
  }

  nav.links {
    height: calc(var(--navbar-height) + env(safe-area-inset-bottom));
    padding-bottom: calc(var(--size-4) + env(safe-area-inset-bottom));

    bottom: 0;
    border-top: var(--border);
    display: flex;
    justify-content: center;
    align-items: center;
    gap: var(--size-8);

    @media (--md) {
      gap: var(--size-7);
    }

    > a {
      color: var(--gray-z-6);
      display: flex;
      align-items: center;
      justify-content: center;
      gap: var(--size-3);
      transition: all var(--speed);

      > .icon {
        color: var(--gray-z-7);
        transition: all var(--speed);
      }

      > span {
        display: none;

        @media (--md) {
          display: inline-block;
        }
      }

      &:--highlight,
      &.router-link-active {
        color: var(--color);

        > .icon {
          color: var(--color);
        }
      }
    }

    @media (--lg) {
      backdrop-filter: none;
      background: transparent;
      border: none;
      bottom: auto;
      top: 0;
      z-index: 41;
      pointer-events: none;
      height: var(--navbar-height);
      padding-bottom: var(--size-4);

      > a {
        pointer-events: all;
      }
    }
  }
</style>
