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
// Set up global swipe tracking
const el = ref()
useSetupGlobalSwipe(el)

const mainNav = ref()
</script>

