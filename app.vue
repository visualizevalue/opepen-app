<template>
  <NuxtPwaManifest />
  <NuxtLoadingIndicator color="var(--color)" />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup>
const { fetchSets } = useSets()
onMounted(() => fetchSets())

useMetaData({
  title: 'Home',
  description: 'Consensus is temporary',
})
</script>

<style scoped>
  main {
    min-height: 100dvh;
  }
</style>

