<template>
  <section v-if="points.length > 1">
    <header>
      <SectionTitle>Opt-In Curve</SectionTitle>
      <span class="muted">{{ formatNumber(total) }}% Demand</span>
    </header>

    <div class="chart">
      <Line :data="data" :options="options" />
    </div>
  </section>
</template>

<script setup>
import { Chart as ChartJS, LineElement, PointElement, LinearScale, Tooltip } from 'chart.js'
import { Line } from 'vue-chartjs'
import { DateTime } from 'luxon'

const props = defineProps({
  submission: {
    type: Object,
    required: true,
  },
})

ChartJS.register(LineElement, PointElement, LinearScale, Tooltip)

const config = useRuntimeConfig()
const events = ref([])

/** Pull the full opt-in log, oldest first. Paginated 20 at a time. */
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

/**
 * Demand is the current state of every collector, not the sum of every event:
 * collectors edit their opt-ins, so replaying the log means replacing a
 * collector's previous contribution rather than adding to it. Summing events
 * instead overcounts (553 against a true 479 on 11x11).
 */
const points = computed(() => {
  const state = new Map()

  return events.value.map((event) => {
    const address = (event.address || '').toLowerCase()

    if (event.is_opt_in) state.set(address, event.max_reveals || {})
    else state.delete(address)

    let demand = 0
    for (const reveals of state.values()) {
      for (const edition of EDITION_KEYS) demand += reveals[edition] || 0
    }

    const hours = DateTime.fromISO(event.created_at).diff(windowStart.value, 'hours').hours

    return {
      // Collectors can opt in before a set is staged. Those land at negative
      // hours, so fold them into hour zero as the demand the window opens with.
      x: Math.max(0, hours),
      y: (demand / TOTAL_EDITION_SIZE) * 100,
      demand,
      account: event.account?.display || shortAddress(event.address),
      optIn: !!event.is_opt_in,
    }
  })
})

/** Consensus runs from the moment the set is staged until it reveals. */
const windowStart = computed(() =>
  props.submission.starred_at
    ? DateTime.fromISO(props.submission.starred_at)
    : DateTime.fromISO(events.value[0]?.created_at || new Date().toISOString()),
)

const windowHours = computed(() => {
  if (!props.submission.starred_at || !props.submission.reveals_at) return 72

  const span = DateTime.fromISO(props.submission.reveals_at).diff(windowStart.value, 'hours').hours

  return Math.round(span) || 72
})

const EDITION_KEYS = ['1', '4', '5', '10', '20', '40']
// 1 + 4 + 5 + 10 + 20 + 40; the same basis the demand table uses.
const TOTAL_EDITION_SIZE = 80

const total = computed(() => Math.round(points.value[points.value.length - 1]?.y || 0))


const data = computed(() => ({
  datasets: [
    {
      data: points.value,
      parsing: false,
      // Points sitting exactly on hour zero straddle the chart edge, so allow a
      // little overdraw or they render as half circles against the axis.
      clip: 8,
      borderColor: Z_COLORS.value.grayZ7,
      backgroundColor: Z_COLORS.value.grayZ1,
      borderWidth: 1,
      fill: false,
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
    // Hours into the consensus window, so every set reads on the same axis
    // regardless of when it was staged.
    x: {
      type: 'linear',
      min: 0,
      max: windowHours.value,
      border: { color: Z_COLORS.value.grayZ2 },
      grid: { display: false },
      ticks: {
        stepSize: 12,
        color: Z_COLORS.value.grayZ5,
        font: { size: 10 },
        callback: (value) => `${value}h`,
      },
    },
    // Ruled every 100%. Only the 100% line is green: that is consensus met.
    y: {
      beginAtZero: true,
      border: { display: false },
      grid: {
        color: (ctx) => (ctx.tick?.value === 100 ? COLORS.green : Z_COLORS.value.grayZ2),
        lineWidth: (ctx) => (ctx.tick?.value === 100 ? 1.5 : 1),
      },
      ticks: {
        stepSize: 100,
        color: Z_COLORS.value.grayZ5,
        font: { size: 10 },
        callback: (value) => `${formatNumber(value)}%`,
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
          const action = point.optIn ? 'Opted in' : 'Opted out'
          return `${action} at ${Math.round(point.x)}h  ·  ${formatNumber(Math.round(point.y))}% demand`
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
