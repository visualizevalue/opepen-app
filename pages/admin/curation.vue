<template>
  <div>
    <div>
      <SectionTitle>Curated Art</SectionTitle>
      <section>
        <input type="text" placeholder="0x0d0e328b8fbc4a148eeae9e7b4791d7a6a0d2d07" v-model="filterAddress">
      </section>
      <ArtistCurationList :address="filterAddress" :query="query" />
    </div>
  </div>
</template>

<script setup>
const filterAddress = ref(null)

const query = computed(() => {
  const q = new URLSearchParams({
    sort: '-vote_score,-votes_count,id',
  })

  return q.toString()
})
</script>

<style lang="postcss" scoped>
section {
  margin: var(--size-5) 0 var(--size-6);
  display: grid;
  gap: var(--size-5);
}
</style>
