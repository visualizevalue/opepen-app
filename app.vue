<template>
  <main>
    <NavBar />

    <NuxtPage />

    <ToggleDarkMode />
  </main>
</template>

<script setup>
import { useWindowSize } from '@vueuse/core'

/**
 * Make 100vh CSS variable available (iOS is weird with native vh)
 */
const { height } = useWindowSize()
const setHeight = () => document.documentElement.style.setProperty('--100vh', `${height.value}px`)
watch(height, setHeight)
onMounted(setHeight)
</script>

<style lang="postcss" scoped>
  main {
    height: var(--100vh);
    overflow: hidden;
  }
</style>
