<template>
  <PageFrameSm>
    <SectionTitle>Opepen Stats</SectionTitle>

    <Stats />
  </PageFrameSm>
</template>

<script setup lang="ts">
const { day, stats } = await useStats()
</script>

