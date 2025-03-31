<template>
  <PaginatedContent :url="url" :query="query" :tag="PageFrameMd" show-empty>
    <template #default="{ items, meta }">
      <PageHeader>
        <SectionTitle class="visible-md-flex">
          Submissions
          <span v-if="false">({{ meta.total || 0 }})</span>
        </SectionTitle>
        <Actions>
          <span>Sort:</span>
          <select v-model="sort" class="select">
            <option value="demand">Demand</option>
            <option value="latest">Latest</option>
            <option value="earliest">Earliest</option>
            <option value="random">Random</option>
          </select>
          <div class="input-group">
            <input class="input" type="text" v-model="search" placeholder="search" />
            <Icon type="search" />
          </div>
        </Actions>
      </PageHeader>

      <SetCardGrid :submissions="items" class="more-space" minimal show-demand />
    </template>
  </PaginatedContent>
</template>

<script setup lang="ts">
import { watchDebounced } from '@vueuse/core'
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
const search = ref((route.query.search as string) || '')
const query = ref('')
const updateQuery = () => {
  const q = new URLSearchParams(`limit=40`)

  if ((sort.value as string) in QUERY_MAP) {
    // @ts-ignore
    q.set('sort', QUERY_MAP[sort.value as string])
  }

  if (sort.value === 'demand') {
    q.set('status', 'demand')
  }

  if (search.value) {
    q.set('search', search.value)
  }

  query.value = q.toString()
}
updateQuery()
watch(sort, () => updateQuery())
watchDebounced(search, () => updateQuery(), {
  debounce: 500,
  maxWait: 2000,
  deep: true,
})

// Maintain currently selected sorting in query parameter
watchEffect(() => {
  router.replace({
    query: {
      ...route.query,
      sort: sort.value,
      search: search.value,
    },
  })
})

const { stats } = await useStats()

useMetaData({
  title: `Set Submissions | Opepen`,
  og: '/og/sets.png',
})
</script>

<style scoped>
header.page-header menu.actions {
  @mixin ui-font;
  font-size: var(--font-sm);
  align-items: center;
  justify-content: flex-end;
  white-space: nowrap;
  flex-wrap: nowrap !important;

  span {
    color: var(--muted);
  }

  select {
    width: min-content;
    font-size: var(--font-sm);
  }

  .input-group {
    flex-shrink: 1;
    width: auto;
  }

  input[type='text'].input {
    text-transform: uppercase !important;
  }
}
</style>
