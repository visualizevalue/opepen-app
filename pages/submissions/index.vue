<template>
    <PaginatedContent
      :url="url"
      :query="query"
      :tag="PageFrameMd"
    >
      <template #before>
        <PageHeader>
          <SectionTitle class="visible-md">
            Submissions ({{ stats?.submissions.sets || 0}})
          </SectionTitle>
          <Actions>
            <span>Sort:</span>
            <select v-model="sort" class="select">
              <option value="demand">Demand</option>
              <option value="latest">Latest</option>
              <option value="earliest">Earliest</option>
              <option value="random">Random</option>
            </select>
          </Actions>
        </PageHeader>
      </template>

      <template #default="{ items }">
        <SetCardGrid :submissions="items" class="more-space" minimal show-demand />
      </template>
    </PaginatedContent>
</template>

<script setup lang="ts">
import PageFrameMd from '~/components/Page/FrameMd.vue'

const QUERY_MAP = {
  demand: `-submission_stats.demand.total`,
  latest: `-published_at`,
  earliest: `created_at`,
  random: `dailyRandom`,
}

const router = useRouter()
const route = useRoute()
const url = `${useApiBase()}/set-submissions`
const sort = ref(route.query.sort || 'demand')
const query = computed(() => {
  const q = new URLSearchParams(`limit=40`)

  if ((sort.value as string) in QUERY_MAP) {
    // @ts-ignore
    q.set('sort', QUERY_MAP[sort.value as string])
  }

  if (sort.value === 'demand') {
    q.set('status', 'demand')
  }

  return q.toString()
})

// Maintain currently selected sorting in query parameter
watchEffect(() => {
  if (route.query.sort !== sort.value) {
    router.replace({ query: { ...route.query, sort: sort.value } })
  }
})

const { stats } = await useStats()

useMetaData({
  title: `Set Submissions | Opepen`,
  og: '/og/sets.png',
})
</script>

<style scoped>
menu {
  @mixin ui-font;
  font-size: var(--font-sm);
  align-items: center;
  justify-content: flex-end;

  span {
    color: var(--muted);
  }

  select {
    width: min-content;
    font-size: var(--font-sm);
  }
}

h1.visible-md {
  @media (--md) {
    display: flex !important;
  }
}
</style>

