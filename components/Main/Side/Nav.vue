<template>
  <nav ref="nav" :style="style">

    <WithAccount v-slot="{ address }">
      <MainSideProfile :address="address" />
    </WithAccount>

    <section>
      <h1>About</h1>

      <MainSideNavLink
        to="/"
        title="The Opepen Protocol"
        subline="Learn how Opepen works"
      />
      <MainSideNavLink
        to="/stats"
        title="Stats"
        subline="Marketplace, Sales, Recent Transactions"
      />
    </section>

    <section>
      <h1>Browse</h1>

      <MainSideNavLink
        to="/permanent"
        title="Permanent Collection"
        subline="Browse Opepen Sets and Tokens"
      />
      <MainSideNavLink
        title="Submissions"
        to="/submissions"
        subline="View submitted Opepen"
      />
      <MainSideNavLink
        to="/listings"
        title="Listings"
        subline="Aggregated Marketplace Listings"
      />
      <MainSideNavLink
        to="/burned"
        title="Burned Opepen"
        subline="All Opepen that have been destroyed"
      />
    </section>

    <section>
      <h1>Submit</h1>

      <MainSideNavLink
        to="/create/set"
        title="Create Set"
        subline="Submit an Opepen Set of 6 editions"
      />
      <MainSideNavLink
        to="/create/single"
        title="Post Single"
        subline="Post a single Opepen artifact"
      />
    </section>

    <section>
      <h1>Community</h1>

      <MainSideNavLink
        to="/artists"
        title="Artists"
        subline="Browse Opepen Contributors"
      />
      <MainSideNavLink
        to="/collectors"
        title="Collectors"
        subline="View the network of Opepen Collectors"
      />
      <MainSideNavLink
        to="/curate"
        title="Curate"
        subline="Vote on Submissions"
      />
    </section>

  </nav>
</template>

<script setup>
import { useElementBounding } from '@vueuse/core'
import { gsap } from 'gsap'

const { isDesktop } = useWindow()

const route = useRoute()

const nav = ref()
const { width } = useElementBounding(nav)

// Whether the side nav is open
const isOpen = ref(false)

const {
  isSwiping,
  direction,
  lengthX,
  coordsStart,
} = useGlobalSwipe()

const translate = ref(0)
const tweened = reactive({
  number: 0
})
const style = computed(() => ({
  transform: `translateX(${tweened.number}px`
}))
watch(translate, (n) => {
  if (tweened.number === translate.value) return
  gsap.to(tweened, { duration: 0.2, number: Number(n) || 0 })
})

// Helpers
const shouldOpen = (threshold = 50) => ! isOpen.value && lengthX.value < -1 * threshold && coordsStart.value.x < 80
const shouldClose = (threshold = 0) => isOpen.value && lengthX.value >= threshold

// Update/Track the isOpen state
watch(route, () => {
  isOpen.value = false
})
watchEffect(() => {
  if (isDesktop.value) {
    isOpen.value = true
  }

  // Don't do anything while we're swiping
  if (isSwiping.value) return

   // Open the nav
   if (shouldOpen(80)) {
     isOpen.value = true
   }

   // Close the nav
   if (shouldClose(120)) {
     isOpen.value = false
   }
})

// Update the translate position
watchEffect(() => {
  let updated = 0
  if (! isOpen.value) {
    updated = -1 * width.value
  }

  if (isSwiping.value) {
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

  if (isSwiping.value) tweened.number = updated
  translate.value = updated
})
</script>

<style scoped>
nav {
  background: var(--gray-z-0);
  overscroll-behavior: auto;
}

section {
  padding: var(--spacer-lg);
  border-bottom: var(--border);

  > h1 {
    @mixin ui-font;
    color: var(--gray-z-5);
    margin-bottom: var(--spacer);
  }
}
</style>

