<template>
  <div class="has-secondary">
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

      <Authenticated #default="{ address }">
        <ArtistCurationList :address="address" :type="type" :query="query" />
      </Authenticated>
    </div>
  </div>
</template>

<script setup>
const route = useRoute()
const router = useRouter()

const type = ref(route.query.type || 'all')
watch([type], () => {
  router.replace({ query: {
    ...route.query,
    type: type.value,
  } })
})

const query = computed(() => {
  const q = new URLSearchParams({
    sort: '-vote_score,-votes_count,id',
    // [`filter[post_id]`]: '!null',
  })

  return q.toString()
})
</script>

<style lang="postcss" scoped>
</style>
