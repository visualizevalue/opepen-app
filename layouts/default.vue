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

<style scoped>
.layout {
  --nav-width: min(24rem, 100vw);

  min-height: 100dvh;

  :deep(> .sidebar) {
    position: fixed;
    overflow-y: auto;
    -webkit-overflow-scrolling: auto;

    width: var(--nav-width);
    height: 100dvh;
    border-right: var(--border);

    z-index: var(--z-index-nav);
  }

  > main {
    position: relative;
    width: 100vw;
    padding:
      calc(var(--top-nav-total-height) + var(--spacer))
      var(--spacer)
      calc(var(--bottom-nav-height) + var(--spacer));
    container-type: inline-size;
  }
}

@media (--md) {

  .layout {
    display: grid;
    grid-template-columns: var(--nav-width) 1fr;

    > main {
      width: calc(100vw - var(--nav-width));
      padding: var(--spacer-lg) var(--spacer-lg);
      left: var(--nav-width);
    }
  }

}
</style>
