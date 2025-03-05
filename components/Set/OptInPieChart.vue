<template>
  <SectionTitle>
    Consensus Breakdown
  </SectionTitle>

  <main v-if="status === 'success'">
    <div @mouseleave="highlightedIndex = null" class="chart">
      <PieChart :data="data" :on-hover="onHover" />
    </div>

    <div class="text">
      <p>{{ decentralizationScore.percentage }}% of demand from {{ enumerate('wallet', decentralizationScore.holders) }}.</p>
      <ol>
        <li
          v-for="(item, index) in list"
          :class="{ highlight: highlightedIndex === index || index === 3 && highlightedIndex >= 3}"
        >
          <NuxtLink v-if="index < 3" :to="`/${item}`">
            <FetchApiAccount :id="item" hide-avatar />
          </NuxtLink>
          <span v-else>Others</span>
          <span v-if="index < 3"> ({{ Math.floor(data.datasets[0].data[index] / totalCount * 100) }}%)</span>
          <span v-if="index >= 3"> ({{ totalCount }} total)</span>
        </li>
      </ol>
    </div>

    <SetCuratorStatTooltip :curator="highlighted" :key="highlightedIndex" />
  </main>
</template>

<script setup>
const props = defineProps({
  submission: Object,
})

const { data: response, status } = await useApi(`/set-submissions/${props.submission.uuid}/curation-stats`, {
  lazy: true
})

const total = computed(() => response.value?.total || {})
const items = computed(() => Object.entries(total.value).sort((a, b) => a[1].demand > b[1].demand ? -1 : 1))
const demandValues = computed(() => items.value.map(([_, { demand }]) => demand).sort((a, b) => b - a))
const totalDemand = computed(() => demandValues.value?.reduce((total, demand) => total + demand, 0))
const data = computed(() => {
  return {
    labels: items.value.map(([address]) => address),
    datasets: [
      {
        data: demandValues.value,
      }
    ],
  }
})
const totalCount = computed(() => data.value.datasets[0].data?.reduce((sum, i) => sum + i, 0))
const decentralizationScore = computed(() => {
  let percentage = 0
  let holders = 0

  while (percentage < 50 || holders < demandValues.length - 1) {
    percentage += parseInt(demandValues.value[holders] / totalDemand.value * 100)
    holders++
  }

  return {
    percentage,
    holders,
  }
})

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

<style scoped>
main {
  --chart-size: 7rem;

  display: grid;
  gap: var(--size-5);
  padding: var(--spacer-sm) var(--spacer) var(--spacer);
  justify-content: flex-start;

  @container (min-width: 30rem) {
    grid-template-columns: var(--chart-size) 1fr;
    align-items: center;
    justify-content: center;
  }

  @container (min-width: 30rem) {
    gap: var(--size-8);
  }

  > .chart {
    width: var(--chart-size);
    display: flex;
  }

  > .text {
    width: 100%;
    display: grid;
    gap: var(--spacer-sm);

    > ol {
      padding: 0 0 0 var(--size-5);
    }
  }
}

p,
li {
  @mixin ui-font;
  color: var(--muted);
  list-style: decimal;
  padding: var(--spacer-xs) 0;
  white-space: nowrap;

  &.highlight,
  &:has(a:--highlight) {
    color: var(--color);
  }
}
</style>
