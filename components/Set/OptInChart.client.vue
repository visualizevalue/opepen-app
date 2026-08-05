<template>
  <section v-if="points.length > 1">
    <header>
      <SectionTitle>Opt-In Curve</SectionTitle>
      <span class="muted">{{ formatNumber(total) }} Opepen</span>
    </header>

    <div class="chart">
      <Line :data="data" :options="options" />
    </div>
  </section>
</template>

<script setup>
import { Chart as ChartJS, LineElement, PointElement, LinearScale, Tooltip, Filler } from 'chart.js'
import { Line } from 'vue-chartjs'
import { DateTime } from 'luxon'

const props = defineProps({
  submission: {
    type: Object,
    required: true,
  },
})

ChartJS.register(LineElement, PointElement, LinearScale, Tooltip, Filler)

const config = useRuntimeConfig()
const events = ref([])

/**
 * The history endpoint is a log of state changes, not an append-only feed of
 * opt-ins: collectors edit and opt out. Accumulate the delta between each
 * event's count and the one it replaced so the curve can go down too.
 */
const loadHistory = async () => {
  const all = []
  let page = 1
  let lastPage = 1

  while (page <= lastPage && page <= 20) {
    const res = await $fetch(
      `${config.public.opepenApi}/set-submissions/${props.submission.uuid}/history?page=${page}`,
    ).catch(() => null)

    if (!res?.data?.length) break

    all.push(...res.data)
    lastPage = res.meta?.last_page || 1
    page++
  }

  events.value = all.sort((a, b) => a.created_at.localeCompare(b.created_at))
}
onMounted(loadHistory)

const points = computed(() => {
  let cumulative = 0

  return events.value.map((event) => {
    cumulative += (event.opepen_count || 0) - (event.previous_opepen_count || 0)

    return {
      x: DateTime.fromISO(event.created_at).toMillis(),
      y: cumulative,
      account: event.account?.display || shortAddress(event.address),
      delta: (event.opepen_count || 0) - (event.previous_opepen_count || 0),
    }
  })
})

const total = computed(() => points.value[points.value.length - 1]?.y || 0)

const data = computed(() => ({
  datasets: [
    {
      data: points.value,
      parsing: false,
      borderColor: Z_COLORS.value.grayZ7,
      backgroundColor: Z_COLORS.value.grayZ1,
      borderWidth: 1,
      fill: true,
      stepped: true,
      pointRadius: 2.5,
      pointHoverRadius: 5,
      pointBackgroundColor: Z_COLORS.value.grayZ0,
      pointBorderColor: Z_COLORS.value.grayZ7,
      pointBorderWidth: 1,
    },
  ],
}))

const options = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  animation: false,
  interaction: { mode: 'nearest', intersect: false },
  scales: {
    // A linear scale of timestamps: chart.js only ships a time scale with a
    // date adapter, and this avoids pulling one in for a single chart.
    x: {
      type: 'linear',
      border: { color: Z_COLORS.value.grayZ2 },
      grid: { display: false },
      ticks: {
        maxTicksLimit: 4,
        color: Z_COLORS.value.grayZ5,
        font: { size: 10 },
        callback: (value) => DateTime.fromMillis(value).toFormat('LLL d'),
      },
    },
    y: {
      beginAtZero: true,
      border: { display: false },
      grid: { color: Z_COLORS.value.grayZ2 },
      ticks: {
        maxTicksLimit: 4,
        color: Z_COLORS.value.grayZ5,
        font: { size: 10 },
        callback: (value) => formatNumber(value),
      },
    },
  },
  plugins: {
    tooltip: {
      displayColors: false,
      backgroundColor: Z_COLORS.value.grayZ1,
      borderColor: Z_COLORS.value.grayZ3,
      borderWidth: 1,
      titleColor: Z_COLORS.value.grayZ9,
      bodyColor: Z_COLORS.value.grayZ6,
      callbacks: {
        // Every point is somebody: credit the collector who moved the line.
        title: (items) => points.value[items[0].dataIndex]?.account || '',
        label: (item) => {
          const point = points.value[item.dataIndex]
          if (!point) return ''
          const sign = point.delta > 0 ? '+' : ''
          return `${sign}${formatNumber(point.delta)} Opepen  ·  ${formatNumber(point.y)} total`
        },
      },
    },
  },
}))
</script>

<style scoped>
section {
  display: grid;
  gap: var(--spacer);
}

header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;

  .muted {
    @mixin ui-font;
    color: var(--muted);
  }
}

.chart {
  position: relative;
  height: 12rem;
}
</style>
