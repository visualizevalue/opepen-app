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
import { gsap } from 'gsap'

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
const closedPosition = () => -1 * width.value

// We calculate custom positioning only after mount
// to prevent unnecessary repaints
const mounted = ref(false)
onMounted(() => (mounted.value = true))

// State
const translate = ref(0)
const tweened = reactive({ number: translate.value })
const style = computed(() => {
  if (!mounted.value) return

  return {
    transform: `translateX(${tweened.number}px)`,
  }
})
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

// Update the translate position
const updateTranslatePosition = () => {
  let updated = 0
  if (!isOpen.value) {
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
watch([isOpen, lengthX, isSwiping], () => updateTranslatePosition())

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
