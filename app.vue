<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup>
import { useWindowSize } from '@vueuse/core'
import { useSets } from '~/helpers/sets'
import { useMetaData } from '~/helpers/head'

/**
 * Make 100vh CSS variable available (iOS is weird with native vh)
 */
const { height } = useWindowSize()
const setHeight = () => document.documentElement.style.setProperty('--100vh', `${height.value}px`)
watch(height, setHeight)
onMounted(setHeight)

const { fetchSets } = useSets()
await fetchSets()

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
