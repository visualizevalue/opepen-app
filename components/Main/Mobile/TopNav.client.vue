<template>
  <nav class="top-nav" :class="{ hidden }">
    <Avatar :account="account" @click="$emit('openMain')" />

    <Icon type="opepen-eye" class="main-logo" @click="scrollTop" />

    <MainOptionsDropdown />
  </nav>

  <nav id="top-sub-nav" :class="{ hidden }"></nav>
</template>

<script setup lang="ts">
import { useWindowScroll } from '@vueuse/core'
import { useAccount } from '@wagmi/vue'

defineEmits([ 'openMain' ])

const { x, y, isScrolling, arrivedState, directions } = useWindowScroll({
  behavior: 'smooth',
})
const scrollTop = () => {
  y.value = 0
}

const { address } = useAccount()
const account = await useProfile(address)

const hidden = ref(false)

watchEffect(() => {
  if (! isScrolling.value || arrivedState.top) return

  if (directions.bottom && y.value > 50) {
    hidden.value = true
  } else if (directions.top) {
    hidden.value = false
  }
})
</script>

<style scoped>
.top-nav,
#top-sub-nav {
  position: fixed;
  height: var(--top-nav-height);
  width: 100vw;
  left: 0;
  align-items: center;
  background: var(--semi);
  border-bottom: var(--border);
  padding: 0 0 0 var(--spacer);
  backdrop-filter: var(--blur);
  transition: transform var(--speed);
}

.top-nav {
  top: 0;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));

  &.hidden {
    transform: translateY(calc(-1 * var(--top-nav-height)));
  }

  .avatar {
    width: var(--size-7);
    height: var(--size-7);
  }

  .main-logo {
    width: var(--size-6);
    height: var(--size-6);
    justify-self: center;
  }

  :deep(.settings) {
    justify-self: flex-end;

    .icon {
      color: var(--gray-z-5);
    }
  }

  @media (--md) {
    display: none;
  }
}

#top-sub-nav {
  display: flex;
  justify-content: center;
  top: var(--top-nav-height);
  height: var(--top-subnav-height);

  &.hidden {
    transform: translateY(calc(-1 * (var(--top-nav-height) + var(--top-subnav-height))));
  }
}
</style>

