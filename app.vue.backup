<template>
  <NuxtPwaManifest />
  <NuxtLoadingIndicator color="var(--color)" />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup>
import { useWindowSize } from '@vueuse/core'
import { useSets } from '~/helpers/sets'
import { useMetaData } from '~/helpers/head'

const { fetchSets } = useSets()
onMounted(() => fetchSets())

useMetaData({
  title: 'Home',
  description: 'This is not a PFP project.',
})
</script>

<style lang="postcss" scoped>
  main {
    min-height: 100dvh;
  }
</style>

<style lang="postcss">
  body {
    min-height: 100dvh;
  }
</style>
