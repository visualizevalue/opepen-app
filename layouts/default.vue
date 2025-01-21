<template>
  <div class="layout" ref="el" @touchMove.prevent="() => null">

    <!-- Sidebar -->
    <MainSideNav />

    <!-- Main App Frame -->
    <main>
      <slot />
    </main>

    <!-- Mobile Nav -->
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
</script>

<style scoped>
.layout {
  --nav-width: min(24rem, 100vw);

  height: 100dvh;

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
    padding: var(--spacer-lg) var(--spacer-lg) calc(var(--bottomnav-height) + var(--spacer-lg));
    container-type: inline-size;
  }
}

@media (--md) {

  .layout {
    display: grid;
    grid-template-columns: var(--nav-width) 1fr;

    > main {
      width: calc(100vw - var(--nav-width));
      left: var(--nav-width);
    }
  }

}
</style>
