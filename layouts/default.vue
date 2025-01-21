<template>
  <div class="layout" ref="el">

    <!-- Sidebar -->
    <MainSideNav />

    <!-- Main App Frame -->
    <main>
      <slot />
    </main>

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

  > nav {
    position: fixed;
    overflow-y: auto;
    -webkit-overflow-scrolling: auto;

    width: var(--nav-width);
    height: 100dvh;
    border-right: var(--border);

    z-index: var(--z-index-nav);
  }

  > main {
    padding: var(--spacer);
    container-type: inline-size;
  }
}

@media (--md) {

  .layout {
    display: grid;
    grid-template-columns: var(--nav-width) 1fr;

    > nav {
      position: relative;
    }
  }

}
</style>
