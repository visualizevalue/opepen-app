<template>
  <nav id="top-nav" :class="{ hidden }">
    <WithProfile v-slot="{ account }">
      <Avatar
        :account="account"
        @click="$emit('openMain')"
        class="eye"
        :class="{ 'live-opt-in': optInAvailable }"
      />
    </WithProfile>

    <Icon type="opepen-eye" class="main-logo" @click="scrollTop" />

    <MainOptionsDropdown />
  </nav>

  <MainMobileTopSubNav :class="{ hidden }" />
</template>

<script setup lang="ts">
import { useWindowScroll } from '@vueuse/core'

defineEmits(['openMain'])

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
  if (!isScrolling.value || arrivedState.top) return

  if (directions.bottom && y.value > 50) {
    hidden.value = true
  } else if (directions.top) {
    hidden.value = false
  }
})

const { optInAvailable } = await useStagedOptIn()
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
    border-radius: 50%;
    border-top-left-radius: var(--border-radius-sm);

    &.live-opt-in {
      position: relative;

      &:after {
        content: '';
        width: calc(var(--size-1) * 1.2);
        height: calc(var(--size-1) * 1.2);
        border-radius: 50%;
        border: var(--border);
        border-color: var(--green-light);
        background: var(--green);
        position: absolute;
        top: var(--size-0);
        right: var(--size-0);
      }
    }
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
