<template>
  <PaginatedContent :url="url" :query="query" :tag="PageFrameMd" show-empty>
    <template #default="{ items, meta, loading, error }">
      <slot name="header" :meta="meta" :loading="loading">
        <PageHeader>
          <slot name="title" />
          <Actions class="actions-container">
            <div class="sort-container">
              <span>Sort:</span>
              <select v-model="sort" class="select">
                <option
                  v-for="option in sortOptions"
                  :key="option.value"
                  :value="option.value"
                >
                  {{ option.label }}
                </option>
              </select>
            </div>
            <div class="input-group">
              <input
                class="input uppercase-input"
                type="text"
                v-model="search"
                placeholder="search"
              />
              <Icon type="search" />
            </div>
          </Actions>
        </PageHeader>
      </slot>

      <slot :items="items" :meta="meta" :loading="loading" :error="error" />
    </template>
  </PaginatedContent>
</template>

<script setup lang="ts">
import { watchDebounced } from '@vueuse/core'
import PageFrameMd from '~/components/Page/FrameMd.vue'

const props = defineProps({
  defaultSort: {
    type: String,
    default: 'latest',
  },
  sortOptions: {
    type: Array,
    default: () => [
      { value: 'latest', label: 'Latest' },
      { value: 'earliest', label: 'Earliest' },
      { value: 'random', label: 'Random' },
    ],
  },
  queryMap: {
    type: Object,
    default: () => ({
      latest: `-created_at`,
      earliest: `created_at`,
      random: `dailyRandom`,
    }),
  },
  baseParams: {
    type: Object,
    default: () => ({}),
  },
})

const router = useRouter()
const route = useRoute()
const url = `${useApiBase()}/set-submissions`
const sort = ref(route.query.sort || props.defaultSort)
const search = ref((route.query.search as string) || '')
const query = ref('')
const updateQuery = () => {
  const q = new URLSearchParams(`limit=40`)

  if (props.baseParams) {
    Object.entries(props.baseParams).forEach(([key, value]) => {
      q.set(key, value as string)
    })
  }

  if (sort.value in props.queryMap) {
    q.set('sort', props.queryMap[sort.value])
  }

  if (
    sort.value === 'demand' &&
    props.queryMap['demand'] === '-submission_stats.demand.total'
  ) {
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

// Maintain query parameters in URL
watchEffect(() => {
  router.replace({
    query: {
      ...route.query,
      sort: sort.value,
      search: search.value,
    },
  })
})
</script>

<style scoped>
:global(header.page-header menu.actions) {
  @mixin ui-font;
  font-size: var(--font-sm);
  align-items: center;
  justify-content: flex-end;
  white-space: nowrap;
  flex-wrap: nowrap !important;
  gap: var(--spacer-sm);

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
}

:global(.sort-container) {
  display: flex;
  align-items: center;
  gap: var(--spacer-sm);
  white-space: nowrap;
}

:global(.actions-container) {
  display: flex;
  align-items: center;
  gap: var(--spacer);
}

:global(.uppercase-input) {
  text-transform: uppercase !important;
}
</style>
