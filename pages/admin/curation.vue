<template>
  <div>
    <div>
      <SectionTitle>Curated Art</SectionTitle>
      <ArtistCurationList :query="query" />
    </div>
  </div>
</template>

<script setup>
const query = computed(() => {
  const q = new URLSearchParams({
    sort: '-vote_score,-votes_count,id',
  })

  return q.toString()
})
</script>

<style lang="postcss" scoped>
</style>
