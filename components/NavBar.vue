<template>
  <nav :class="{ 'scrolled': isScrolled }">
    <NuxtLink to="/">
      <Logo />
    </NuxtLink>

    <!-- <Button to="/create" @click="onCreateClick">
      <Icon type="plus" />
      <span>Create</span>
    </Button> -->

    <Button :to="setUrl">
      <Icon type="grid" />
      <span>Sets</span>
    </Button>
    <Connect />
  </nav>
</template>

<script setup>
import { useWindowScroll } from '@vueuse/core'
import pad from '~/helpers/pad'
import { useSets } from '~/helpers/sets'

const { y } = useWindowScroll()

const isScrolled = computed(() => y.value > 5)

const { currentSet, fetchSets } = useSets()
const setUrl = computed(() => `/sets/${currentSet.value ? pad(currentSet.value.id) : '003'}`)
onMounted(() => fetchSets())

const onCreateClick = () => {
  setTimeout(() => {
    nextTick(() => {
      const el = document.querySelector('.prompt-input textarea')

      el?.focus()
    })
  }, 50)
}
</script>

<style lang="postcss" scoped>
  nav {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: var(--navbar-height);
    padding: var(--size-4);
    display: flex;
    gap: var(--size-3);
    background-color: var(--semi);
    z-index: 195;
    border-bottom: var(--border);
    border-color: transparent;
    backdrop-filter: var(--blur);
    transition: all var(--speed-fast);

    &.scrolled {
      border-color: var(--gray-z-2);
    }

    > :first-child {
      margin-right: auto;
      display: flex;
      align-items: center;

      :deep(svg:last-child) {
        display: none;

        @media (--sm) {
          display: initial;
        }
      }
    }

    :deep(+ div) {
      position: relative;
      min-height: var(--100vh);
      padding: calc(var(--navbar-height) + var(--size-4)) var(--size-4) var(--size-5);
    }
  }
</style>
