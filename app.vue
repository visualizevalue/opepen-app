<template>
  <main>
    <NavBar />

    <NuxtPage />

    <FooterLinks />

    <ToggleDarkMode />
  </main>
</template>

<script setup>
import { useWindowSize } from '@vueuse/core'
import { useMetaData } from './helpers/head';

/**
 * Make 100vh CSS variable available (iOS is weird with native vh)
 */
const { height } = useWindowSize()
const setHeight = () => document.documentElement.style.setProperty('--100vh', `${height.value}px`)
watch(height, setHeight)
onMounted(setHeight)

useMetaData({
  title: 'Home',
  description: 'This is not a PFP project.',
})
</script>

<style lang="postcss" scoped>
  main {
    min-height: var(--100vh);
  }
</style>

<style lang="postcss">
  body {
    min-height: var(--100vh);
  }
</style>
