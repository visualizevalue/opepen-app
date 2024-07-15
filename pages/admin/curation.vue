<template>
  <div>
    <div>
      <PageHeader>
        <h1 class="breadcrumb">
          <span>Curated Art</span>
        </h1>

        <div class="actions">
          <select v-model="type" class="input sm">
            <option value="all">All</option>
            <option value="singles">Singles</option>
            <option value="sets">Sets</option>
            <!-- <option value="perSet">Per Set</option> -->
          </select>
        </div>
      </PageHeader>

      <section>
        <input type="text" placeholder="0x0d0e328b8fbc4a148eeae9e7b4791d7a6a0d2d07" v-model="filterAddress">
      </section>

      <ArtistCurationList :address="filterAddress" :type="type" :query="query" />
    </div>
  </div>
</template>

<script setup>
const route = useRoute()
const router = useRouter()

const type = ref(route.query.type || 'all')
const filterAddress = ref(route.query.filterAddress || '')

watch([type, filterAddress], () => {
  router.replace({ query: {
    ...route.query,
    type: type.value,
    filterAddress: filterAddress.value,
  } })
})

const query = computed(() => {
  const q = new URLSearchParams({
    sort: '-vote_score,-votes_count,id',
  })

  return q.toString()
})
</script>

<style lang="postcss" scoped>
section {
  margin: var(--size-5) auto var(--size-6);
  display: grid;
  gap: var(--size-5);
  max-width: var(--content-width);
}
</style>
