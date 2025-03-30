<template>
  <NuxtPwaManifest />
  <NuxtLoadingIndicator color="var(--color)" />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup>
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
