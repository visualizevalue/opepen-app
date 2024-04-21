<template>
  <section v-if="count">
    <header>
      <h1>Consensus Breakdown</h1>

      <span>{{ count }} Collectors</span>
    </header>

    <main>
      <div @mouseleave="highlightedIndex = null">
        <PieChart :data="data" :on-hover="onHover" />
      </div>

      <ol>
        <li
          v-for="(item, index) in list"
          :class="{ highlight: highlightedIndex === index || index === 3 && highlightedIndex >= 3}"
        >
          <Account v-if="index < 3" :address="item" :hide-avatar="true" />
          <span v-else>Others</span>
          <span v-if="index < 3"> ({{ Math.floor(data.datasets[0].data[index] / totalCount * 100) }}%)</span>
        </li>
      </ol>

      <SetCuratorStatTooltip :curator="highlighted" :key="highlightedIndex" />
    </main>
  </section>
</template>

<script setup>
const props = defineProps({
  submission: Object,
  subscription: Object,
})

const config = useRuntimeConfig()
const { data: response } = await useFetch(`${config.public.opepenApi}/set-submissions/${props.submission.uuid}/curation-stats`)

const total = computed(() => response.value?.total || {})
const count = computed(() => Object.keys(total.value)?.length)
const items = computed(() => Object.entries(total.value).sort((a, b) => a[1].demand > b[1].demand ? -1 : 1))
const data = computed(() => {
  return {
    labels: items.value.map(([address, { opepens, demand }]) => address),
    datasets: [
      {
        data: items.value.map(([address, { opepens, demand }]) => demand),
      }
    ],
  }
})
const totalCount = computed(() => data.value.datasets[0].data?.reduce((sum, i) => sum + i, 0))

const list = computed(() => {
  const all = data.value.labels
  const addOthers = all.length > 4
  const labels = addOthers ? all.slice(0, 3) : all

  if (addOthers) {
    labels.push('Others')
  }

  return labels
})

const highlightedIndex = ref(null)
const highlighted = computed(() => Number.isInteger(highlightedIndex.value) ? items.value[highlightedIndex.value] : null)

const onHover = (_event, item) => {
  highlightedIndex.value = item[0]?.index ?? null
}
</script>

<style lang="postcss" scoped>
section {
  padding: 0 !important;

  > header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-top: var(--border);
    border-bottom: var(--border);
    padding: var(--size-2) var(--size-4);
    color: var(--gray-z-6);
  }

  > main {
    display: grid;
    grid-template-columns: 50% 1fr;
    gap: var(--size-5);
    padding: var(--size-4);
    align-items: center;

    > div {
      max-width: 8rem;
    }
  }
}

li {
  color: var(--gray-z-5);
  list-style: decimal;

  &.highlight {
    color: var(--gray-z-9);
  }
}
</style>
