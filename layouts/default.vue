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

// Ensure proper sizing redraws on mobile safari
const route = useRoute()
watch(route, () => {
  if (! el.value) return

  nextTick(() => {
    if (document.getElementById('top-sub-nav')?.innerHTML.trim() === '') {
      el.value.style.setProperty('--main-padding-top', 'calc(var(--top-nav-height) + var(--spacer))')
    } else {
      el.value.style.setProperty('--main-padding-top', 'calc(var(--top-nav-total-height) + var(--spacer))')
    }
  })
})
</script>

