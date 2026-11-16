<template>
  <nav ref="nav" :style="style" class="sidebar">
    <NuxtLink to="/" class="brand" @click="close">
      <Icon type="opepen-eye" />
      <span>Opepen</span>
    </NuxtLink>

    <section>
      <MainSideNavLink to="/" icon="home" title="Home" @click="close" strict-exact />
      <MainSideNavLink to="/about" icon="info" title="How It Works" @click="close" />
      <MainSideOptIn @click="close" />
    </section>

    <section>
      <h2>Browse</h2>

      <MainSideNavLink to="/sets" icon="opepen-grid" title="Collection" @click="close" />
      <MainSideNavLink to="/submissions" icon="layers" title="Submissions" @click="close" />
      <MainSideNavLink to="/artists" icon="users" title="Artists" @click="close" />
    </section>

    <section>
      <h2>Create</h2>

      <MainSideNavLink to="/create/new" icon="plus-circle" title="New Set" @click="close" />
      <MainSideNavLink
        to="/create"
        icon="folder"
        title="Your Sets"
        @click="close"
        strict-exact
      />
      <MainSideNavLink to="/contribute" icon="edit-3" title="Contribute" @click="close" />
    </section>

    <div class="bottom">
      <WithAccount>
        <MainSideProfile @sendClose="close" />
      </WithAccount>

      <footer>
        <NuxtLink to="https://x.com/opepenedition" target="_blank" title="View on X.com">
          <Icon type="x.com" />
        </NuxtLink>
        <NuxtLink
          to="https://opensea.io/collection/opepen-edition"
          target="_blank"
          title="View on OpenSea"
        >
          <Icon type="opensea" />
        </NuxtLink>
        <NuxtLink
          :to="`https://etherscan.io/token/${contract}`"
          target="_blank"
          title="View on Etherscan"
        >
          <Icon type="etherscan" />
        </NuxtLink>
        <NuxtLink
          to="https://github.com/visualizevalue?q=opepen"
          target="_blank"
          title="View on Github"
        >
          <Icon type="github" />
        </NuxtLink>

        <BuiltOnEthereum class="built-on-ethereum" />
      </footer>
    </div>
  </nav>

  <ClientOnly>
    <div
      class="sidebar-overlay"
      :style="overlayStyle"
      @click="close"
      @touchstart.passive="close"
    ></div>
    <template #fallback>
      <div class="sidebar-overlay"></div>
    </template>
  </ClientOnly>
</template>

<script setup>
import { useElementBounding, useScrollLock } from '@vueuse/core'

const contract = useConfig('opepenContract')

const { isDesktop } = useWindow()

const nav = ref()
const { width } = useElementBounding(nav)

// Whether the side nav is open
const isOpen = ref(!!isDesktop.value)
const close = () => (isOpen.value = false)
const open = () => (isOpen.value = true)

const { isSwiping, lengthX, coordsStart, isHorizontal } = useGlobalSwipe()

// Helpers
const shouldOpen = (threshold = 50) =>
  !isOpen.value && lengthX.value < -1 * threshold && coordsStart.value.x < 80
const shouldClose = (threshold = 0) => isOpen.value && lengthX.value >= threshold

// We calculate custom positioning only after mount
// to prevent unnecessary repaints
const mounted = ref(false)
onMounted(() => (mounted.value = true))

/*
 * Position. While a finger drags the drawer it follows in pixels with no
 * easing; otherwise it rests fully open or fully closed and CSS animates the
 * change. (This used to be a gsap tween, which pulled an animation library,
 * and the 3D engine bundled beside it, into every page.)
 */
const SLIDE = '0.2s ease-out'
const dragging = computed(() => isSwiping.value && isHorizontal.value && !isDesktop.value)
const dragX = computed(() => {
  // Swiping left, closing
  if (shouldClose(0)) return Math.min(lengthX.value * -1, 0)
  // Swiping right from the edge, opening
  if (shouldOpen(50)) return Math.min(-1 * width.value - lengthX.value, 0)

  return isOpen.value ? 0 : -1 * width.value
})
const style = computed(() => {
  if (!mounted.value) return
  if (isDesktop.value) return { transform: 'translateX(0)' }
  if (dragging.value) return { transform: `translateX(${dragX.value}px)`, transition: 'none' }

  return {
    transform: isOpen.value ? 'translateX(0)' : 'translateX(-100%)',
    transition: `transform ${SLIDE}`,
  }
})

// How far open the drawer is, 0 to 1. Drives the dimming overlay.
const progress = computed(() => {
  if (!dragging.value) return isOpen.value ? 1 : 0

  return width.value ? Math.max(0, 1 - Math.abs(dragX.value / width.value)) : 0
})
const overlayStyle = computed(() => ({
  opacity: 0.8 * progress.value,
  transition: dragging.value ? 'none' : `opacity ${SLIDE}`,
  pointerEvents: isOpen.value ? 'all' : 'none',
}))

// Open close default state if switching between mobile and desktop
watch(isDesktop, () => {
  if (isDesktop.value) open()
  else close()
})
// Update/Track the isOpen state
watchEffect(() => {
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
  // Lock document scroll only when sidebar is open on mobile
  documentScrollLocked.value = isOpen.value && !isDesktop.value
  // Lock nav scroll during horizontal swipe to prevent sidebar internal scroll
  navScrollLocked.value = isSwiping.value && isHorizontal.value
})

defineExpose({
  open,
  close,
})
</script>

<style scoped>
.sidebar {
  background: var(--gray-z-05);
  overscroll-behavior: auto;
  transform: translateX(-100%);
  display: flex;
  flex-direction: column;
  padding: var(--spacer) var(--size-3) calc(var(--size-3) + env(safe-area-inset-bottom));

  @media (--lg) {
    transform: translateX(0);
  }
}

/* The app name, set like a sidebar's large title. */
.brand {
  display: flex;
  align-items: center;
  gap: var(--size-2);
  padding: var(--size-2) var(--size-3) var(--size-4);
  font-family: var(--font-family-brand);
  text-transform: uppercase;
  font-size: 1.375rem;
  font-weight: 400;
  letter-spacing: var(--brand-letter-spacing);

  .icon {
    width: var(--size-6);
    height: var(--size-6);
  }
}

section {
  display: grid;
  gap: 2px;
  padding-bottom: var(--size-5);

  /* Section header: small and quiet, above its rows. */
  > h2 {
    padding: 0 var(--size-3) var(--size-1);
    font-family: var(--font-family-brand);
    font-size: var(--label-font-size);
    font-weight: 400;
    letter-spacing: var(--label-letter-spacing);
    text-transform: uppercase;
    color: var(--gray-z-5);
  }
}

.bottom {
  margin-top: auto;
  display: grid;
  gap: var(--size-3);
}

footer {
  padding: 0 var(--size-3);
  display: flex;
  gap: var(--size-4);
  align-items: center;

  a {
    color: var(--gray-z-5);
    transition: color var(--speed);

    &:--highlight {
      color: var(--color);
    }
  }

  .icon {
    display: flex;
    width: 1.125rem;
    height: 1.125rem;
  }

  .built-on-ethereum {
    margin-left: auto;
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
