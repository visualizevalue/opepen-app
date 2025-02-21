<template>
  <nav id="top-nav" :class="{ hidden }">
    <WithProfile v-slot="{ account, isConnected }">
      <Avatar v-if="isConnected" :account="account" @click="$emit('openMain')" class="eye" />
      <Avatar v-else @click="$emit('openMain')" class="eye" />
    </WithProfile>

    <Icon type="opepen-eye" class="main-logo" @click="scrollTop" />

    <MainOptionsDropdown />
  </nav>

  <MainMobileTopSubNav :class="{ hidden }" />
</template>

<script setup lang="ts">
import { useWindowScroll } from '@vueuse/core'

defineEmits([ 'openMain' ])

const route = useRoute()
const { y, isScrolling, arrivedState, directions } = useWindowScroll({
  behavior: 'smooth',
})
const scrollTop = () => {
  y.value = 0
}

const hidden = ref(false)

watch(route, () => {
  hidden.value = false
})
watchEffect(() => {
  if (! isScrolling.value || arrivedState.top) return

  if (directions.bottom && y.value > 50) {
    hidden.value = true
  } else if (directions.top) {
    hidden.value = false
  }
})
</script>

<style>
#top-nav,
#top-sub-nav {
  position: fixed;
  height: var(--top-nav-height);
  width: 100vw;
  left: 0;
  align-items: center;
  background: var(--semi);
  border-bottom: var(--border);
  padding: 0;
  backdrop-filter: var(--blur);
  transition: transform var(--speed);

  @media (--lg) {
    display: none !important;
  }
}

#top-nav {
  top: 0;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));

  &.hidden {
    transform: translateY(calc(-1 * var(--top-nav-height)));
  }

  .avatar {
    width: calc(var(--size-6) + var(--size-1));
    height: calc(var(--size-6) + var(--size-1));
    margin-left: var(--spacer);
  }

  .main-logo {
    width: var(--size-6);
    height: var(--size-6);
    justify-self: center;
  }

  .settings {
    justify-self: flex-end;

    .icon {
      color: var(--gray-z-5);
    }
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

  &:empty {
    display: none !important;
  }
}
</style>

