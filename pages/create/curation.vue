<template>
  <div class="has-secondary">
    <div>
      <SectionTitle>My Curated Art</SectionTitle>
      <Authenticated #default="{ address }">
        <ArtistCurationList :address="address" :query="query" />
      </Authenticated>
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
