<template>
  <div class="layout" ref="el" @touchMove.prevent="() => null">

    <!-- Sidebar -->
    <MainSideNav ref="mainNav" />

    <!-- Main App Frame -->
    <main>
      <slot />
    </main>

    <!-- Mobile Nav -->
    <MainMobileTopNav @openMain="mainNav.open()" />
    <MainMobileBottomNav />

    <!-- Floating -->
    <BuiltOnEthereum />

    <!-- Global Data -->
    <WatchSession />

  </div>
</template>

<script setup>
import { useWindowSize, useSwipe } from '@vueuse/core'

// Set up global swipe tracking
const el = ref()
useSetupGlobalSwipe(el)

const mainNav = ref()
</script>

<style>
.layout {
  min-height: 100dvh;

  --main-padding-top: calc(var(--top-nav-total-height) + var(--spacer));
  --main-padding-x: var(--spacer);
  --main-padding-bottom: calc(var(--bottom-nav-height) + var(--spacer));
  --main-content-height: calc(100dvh - var(--main-padding-top) - var(--main-padding-bottom));

  &:has(#top-sub-nav:empty) {
    --main-padding-top: calc(var(--top-nav-height) + var(--spacer));
    --main-padding-bottom: calc(var(--bottom-nav-height) + var(--spacer));
  }

  @media (--lg) {
    --main-padding-top: var(--spacer-lg);
    --main-padding-x: var(--spacer-lg);
    --main-padding-bottom: var(--spacer-lg);
  }

  > .sidebar {
    position: fixed;
    overflow-y: auto;
    -webkit-overflow-scrolling: auto;

    width: var(--nav-width);
    height: 100dvh;
    border-right: var(--border);

    z-index: var(--z-index-nav);

    transform: translateX(calc(-1 * var(--nav-width)));

    @media (--lg) {
      transform: translateX(0);
    }
  }

  > main {
    position: relative;
    width: 100vw;
    container-type: inline-size;
    padding: var(--main-padding-top) var(--main-padding-x) var(--main-padding-bottom);
  }

  @media (--lg) {
    display: grid;
    grid-template-columns: var(--nav-width) 1fr;

    > main {
      width: calc(100vw - var(--nav-width));
      left: var(--nav-width);
    }
  }
}
</style>

