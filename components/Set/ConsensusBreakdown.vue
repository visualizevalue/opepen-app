<template>
  <SectionTitle>Consensus Breakdown</SectionTitle>

  <main v-if="status === 'success'">
    <div @mouseleave="highlightedIndex = -1" class="chart">
      <PieChart :data="data" :on-hover="onHover" />
    </div>

    <div class="text">
      <p>
        {{ decentralizationScore.percentage }}% of demand from
        {{ enumerate('wallet', decentralizationScore.holders) }};
        {{ enumerate('opt-in', decentralizationScore.avg) }} per wallet on average.
      </p>
      <ol>
        <li
          v-for="(item, index) in list"
          :class="{
            highlight: highlightedIndex === index || (index === 3 && highlightedIndex >= 3),
          }"
        >
          <NuxtLink v-if="index < 3" :to="`/${item}`">
            <FetchApiAccount :id="item" hide-avatar />
          </NuxtLink>
          <span v-else>Others</span>
          <span v-if="index < 3">
            ({{ Math.floor((data.datasets[0].data[index] / totalCount) * 100) }}%)
          </span>
          <span v-if="index >= 3">({{ totalCount }} total)</span>
        </li>
      </ol>
    </div>

    <SetCuratorStatTooltip v-if="highlighted" :curator="highlighted" :key="highlightedIndex" />
  </main>
</template>

<script setup lang="ts">
const { submission, lastUpdated } = defineProps<{
  submission: SetSubmission
  lastUpdated: number
}>()

const {
  data: response,
  status,
  refresh,
} = await useApi<{
  total: {
    [key: string]: { demand: number; opepens: number }
  }
}>(`/set-submissions/${submission.uuid}/curation-stats`, {
  lazy: true,
})
watch(
  () => lastUpdated,
  () => refresh(),
)

const total = computed(() => response.value?.total || {})
const items = computed(() =>
  Object.entries(total.value).sort((a, b) => (a[1].demand > b[1].demand ? -1 : 1)),
)
const demandValues = computed(() =>
  items.value.map(([_, { demand }]) => demand).sort((a, b) => b - a),
)
const totalDemand = computed(() =>
  demandValues.value?.reduce((total, demand) => total + demand, 0),
)
const data = computed(() => {
  return {
    labels: items.value.map(([address]) => address),
    datasets: [
      {
        data: demandValues.value,
      },
    ],
  }
})
const totalCount = computed(() => data.value.datasets[0].data?.reduce((sum, i) => sum + i, 0))
const decentralizationScore = computed(() => {
  const demandThreshold = Math.ceil(totalDemand.value / 2 + 1)

  let demand = 0
  let holders = 0
  while (demand < demandThreshold && holders < demandValues.value.length - 1) {
    demand += demandValues.value[holders]
    holders++
  }

  const percentage = Math.round((demand / totalDemand.value) * 100)

  return {
    percentage,
    holders,
    avg: Math.round(totalDemand.value / demandValues.value.length),
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

const highlightedIndex = ref(-1)
const highlighted = computed(() =>
  Number.isInteger(highlightedIndex.value) ? items.value[highlightedIndex.value] : null,
)

const onHover = (_: null, item: { index: number }[]) => {
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

  &.highlight,
  &:has(a:--highlight) {
    color: var(--color);
  }
}
</style>
