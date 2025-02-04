<template>
  <nav ref="nav" :style="style" class="sidebar">

    <WithAccount v-slot="{ address }">
      <MainSideProfile :address="address" @sendClose="close" />
    </WithAccount>

    <section>
      <h1>About</h1>

      <MainSideNavLink
        to="/about/intro"
        title="The Opepen Protocol"
        subline="Learn how Opepen works"
        @click="close"
      />
      <MainSideNavLink
        to="/about/stats"
        title="Stats"
        subline="Marketplace, Sales, Recent Transactions"
        @click="close"
      />
    </section>

    <section>
      <h1>Browse</h1>

      <MainSideNavLink
        to="/sets"
        title="Permanent Collection"
        subline="Browse Opepen Sets and Tokens"
        @click="close"
      />
      <MainSideNavLink
        to="/submissions"
        title="Submissions"
        subline="View submitted Opepen"
        @click="close"
      />

      <!-- <MainSideNavLink -->
      <!--   to="/listings" -->
      <!--   title="Listings" -->
      <!--   subline="Aggregated Marketplace Listings" -->
      <!--   @click="close" -->
      <!-- /> -->
      <!-- <MainSideNavLink -->
      <!--   to="/burned" -->
      <!--   title="Burned Opepen" -->
      <!--   subline="All Opepen that have been destroyed" -->
      <!--   @click="close" -->
      <!-- /> -->
    </section>

    <section>
      <h1>Create</h1>

      <MainSideNavLink
        to="/create"
        title="Your Submissions"
        subline="Manage your set submissions"
        @click="close"
        strict-exact
      />
      <MainSideNavLink
        to="/create/new"
        title="Create Opepen Set"
        subline="Submit an Opepen Set of 6 editions"
        @click="close"
      />
    </section>

    <section>
      <h1>Community</h1>

      <MainSideNavLink
        to="/community/artists"
        title="Artists"
        subline="Browse Opepen Contributors"
        @click="close"
      />
      <MainSideNavLink
        to="/community/collectors"
        title="Collectors"
        subline="View the network of Opepen Collectors"
        @click="close"
      />
    </section>

  </nav>

  <ClientOnly>
    <div class="sidebar-overlay" :style="overlayStyle" @click="close" @touchstart="close"></div>
    <template #fallback>
      <div class="sidebar-overlay"></div>
    </template>
  </ClientOnly>
</template>

<script setup>
import { useElementBounding, useScrollLock } from '@vueuse/core'
import { gsap } from 'gsap'

const { isDesktop } = useWindow()

const nav = ref()
const { width } = useElementBounding(nav)

// Whether the side nav is open
const isOpen = ref(!! isDesktop.value)
const close = () => isOpen.value = false
const open = () => isOpen.value = true

const {
  isSwiping,
  direction,
  lengthX,
  coordsStart,
  isHorizontal,
} = useGlobalSwipe()

// Helpers
const shouldOpen = (threshold = 50) => ! isOpen.value && lengthX.value < -1 * threshold && coordsStart.value.x < 80
const shouldClose = (threshold = 0) => isOpen.value && lengthX.value >= threshold
const closedPosition = () => -1 * width.value

// State
const translate = ref(0)
const tweened = reactive({ number: translate.value })
const style = computed(() => ({
  transform: `translateX(${tweened.number}px)`
}))
const overlayStyle = computed(() => ({
  opacity: 0.8 - (width.value ? Math.abs(tweened.number / width.value) : 0),
  pointerEvents: isOpen.value ? 'all' : 'none',
}))
watch(translate, (n) => {
  if (tweened.number === translate.value) return
  gsap.to(tweened, { duration: 0.2, number: Number(n) || 0 })
})

// Initial state
onMounted(() => {
  if (isDesktop.value) {
    translate.value = 0
    tweened.number = 0
  } else {
    translate.value = closedPosition()
    tweened.number = translate.value
  }
})

// Update/Track the isOpen state
watchEffect(() => {
  if (isDesktop.value) open()

  // Don't do anything while we're swiping
  if (isSwiping.value) return

   // Open the nav
   if (shouldOpen(80)) open()

   // Close the nav
   if (shouldClose(120)) close()
})

// Lock the scroll on the window
const documentScrollLocked = useScrollLock(document)
const navScrollLocked = useScrollLock(nav)
watchEffect(() => {
  let lockDoc = false
  let lockNav = false

  if (isSwiping.value && isHorizontal.value) {
    lockDoc = true
    lockNav = true
  }
  if (isOpen.value && !isDesktop.value) {
    lockDoc = true
  }

  documentScrollLocked.value = lockDoc
  navScrollLocked.value = lockNav
})

// Update the translate position
const updateTranslatePosition = () => {
  let updated = 0
  if (! isOpen.value) {
    updated = closedPosition()
  }

  if (isSwiping.value && isHorizontal.value) {
    // Swiping left
    if (shouldClose(0)) {
      updated = lengthX.value * -1
    }

    // Swiping right
    if (shouldOpen(50)) {
      updated = -1 * width.value + -1 * lengthX.value
    }
  }

  updated = Math.min(updated, 0)

  if (isDesktop.value) updated = 0
  if (isSwiping.value || isDesktop.value) tweened.number = updated

  translate.value = updated
}
watch([isDesktop, isOpen, lengthX, isSwiping], () => updateTranslatePosition())

defineExpose({
  open,
  close,
})
</script>

<style scoped>
.sidebar {
  background: var(--gray-z-0);
  overscroll-behavior: auto;
  transform: translateX(-100%);

  @media (--lg) {
    transform: translateX(0);
  }
}

section {
  display: grid;
  gap: var(--size-2);
  padding: var(--spacer-lg);
  border-bottom: var(--border);

  > h1 {
    @mixin ui-font;
    color: var(--gray-z-5);
    margin-bottom: var(--size-2);
  }
}

.sidebar-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: var(--z-index-nav-overlay);
  background-color: var(--background);
  pointer-events: none;
  opacity: 0;

  @media (--lg) {
    display: none;
  }
}
</style>

