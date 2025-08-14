<template>
  <div class="heatmap-wrapper">
    <div class="heatmap-scroll-container">
      <div class="heatmap-content" :style="{ width: `${heatmapWidth}px` }">
        <div class="month-labels" :style="{ width: `${heatmapWidth}px` }">
          <div
            v-for="month in monthLabels"
            :key="month.key"
            class="month-label"
            :style="{
              left: `${(month.start - 1) * CELL_SIZE + PADDING}px`,
            }"
          >
            {{ month.name }}
          </div>
        </div>

        <div class="heatmap-grid" :style="{ width: `${heatmapWidth}px` }">
          <div
            v-for="day in heatmapData"
            :key="day.date"
            class="heatmap-cell"
            :class="{ 'has-data': day.count > 0 }"
            :style="{
              backgroundColor: getHeatmapColor(day.count),
              opacity: getHeatmapOpacity(day.count),
              left: `${day.weekIndex * CELL_SIZE + PADDING}px`,
              top: `${day.dayOfWeek * CELL_SIZE}px`,
            }"
            :title="getTooltip(day)"
          >
            <span v-if="day.count > 0" class="burn-count">{{ day.count }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="heatmap-legend">
      <span class="legend-label">Less</span>
      <div class="legend-scale">
        <div v-for="i in 5" :key="i" class="legend-cell" :style="{ opacity: i * 0.2 }"></div>
      </div>
      <span class="legend-label">More</span>
    </div>
  </div>
</template>

<script setup>
const { burnedData, setsById } = defineProps({
  burnedData: {
    type: Array,
    required: true,
  },
  setsById: {
    type: Object,
    required: true,
  },
})

const createDailyStats = () => {
  const dailyStats = new Map()
  burnedData.forEach((token) => {
    const date = new Date(token.burned_at).toISOString().split('T')[0]
    const setId = token.opepen?.set_id || null

    if (!dailyStats.has(date)) {
      dailyStats.set(date, new Map())
    }
    const dayStats = dailyStats.get(date)
    dayStats.set(setId, (dayStats.get(setId) || 0) + 1)
  })
  return dailyStats
}

const heatmapData = computed(() => {
  if (!burnedData.length) return []

  const dailyStats = createDailyStats()
  const dates = Array.from(dailyStats.keys()).sort()
  if (!dates.length) return []

  const startDate = new Date(dates[0])
  const endDate = new Date()
  const firstSunday = new Date(startDate)
  firstSunday.setDate(startDate.getDate() - startDate.getDay())

  const heatmapArray = []
  const currentDate = new Date(firstSunday)
  let weekIndex = 0

  while (currentDate <= endDate) {
    const dateString = currentDate.toISOString().split('T')[0]
    const dayOfWeek = currentDate.getDay()

    const dayData = {
      date: dateString,
      weekIndex,
      dayOfWeek,
      count: 0,
      sets: [],
    }

    if (dailyStats.has(dateString)) {
      const sets = dailyStats.get(dateString)
      dayData.sets = Array.from(sets.entries())
        .map(([setId, count]) => ({ setId, count }))
        .sort((a, b) => b.count - a.count)
      dayData.count = dayData.sets.reduce((sum, set) => sum + set.count, 0)
    }

    heatmapArray.push(dayData)
    currentDate.setDate(currentDate.getDate() + 1)

    if (currentDate.getDay() === 0) {
      weekIndex++
    }
  }

  return heatmapArray
})

const totalWeeks = computed(() => {
  if (!heatmapData.value.length) return 0
  return Math.max(...heatmapData.value.map((day) => day.weekIndex)) + 1
})

const CELL_SIZE = 18
const PADDING = 6
const heatmapWidth = computed(() => totalWeeks.value * CELL_SIZE + PADDING * 2)

const monthLabels = computed(() => {
  if (!heatmapData.value.length) return []

  const monthMap = new Map()
  heatmapData.value.forEach((day) => {
    const date = new Date(day.date)
    const monthKey = `${date.getFullYear()}-${date.getMonth()}`

    if (!monthMap.has(monthKey)) {
      monthMap.set(monthKey, {
        name: date.toLocaleDateString('en-US', { month: 'short' }),
        year: date.getFullYear(),
        weekIndex: day.weekIndex,
      })
    }
  })

  return Array.from(monthMap.values()).map((month, index) => ({
    key: `${month.year}-${index}`,
    name:
      month.name === 'Jan' ? `${month.name} ${month.year.toString().slice(-2)}` : month.name,
    start: month.weekIndex + 1,
  }))
})

const getTooltip = (day) => {
  if (day.count === 0) {
    return `${formatDate(day.date)}: No burns`
  }

  const setNames = day.sets
    .map((set) => {
      if (set.setId === null) return `Unrevealed (${set.count})`
      const setName = setsById[set.setId]?.submission?.name || `Set ${set.setId}`
      return `${setName} (${set.count})`
    })
    .join(', ')

  return `${formatDate(day.date)}: ${day.count} burn${day.count !== 1 ? 's' : ''} - ${setNames}`
}

const getHeatmapOpacity = (count) => {
  const opacityMap = {
    0: 0.1,
    1: 0.3,
  }
  if (count in opacityMap) return opacityMap[count]
  if (count <= 3) return 0.5
  if (count <= 5) return 0.7
  if (count <= 10) return 0.9
  return 1.0
}

const getHeatmapColor = (count) => {
  return count === 0 ? 'var(--gray-z-5)' : 'var(--red)'
}
</script>

<style scoped>
.heatmap-wrapper {
  margin-bottom: calc(var(--spacer) * 2);
  width: 100%;
  overflow: hidden;
  container-type: inline-size;
}

.heatmap-scroll-container {
  width: 100%;
  overflow-x: scroll;
  overflow-y: visible;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  background: var(--gray-z-0);
}

.heatmap-content {
  position: relative;
  padding: var(--size-2);
  min-height: 120px;
}

.month-labels {
  position: relative;
  height: 20px;
}

.month-label {
  position: absolute;
  top: 0;
  font-size: var(--font-xs);
  color: var(--muted);
  text-align: left;
  white-space: nowrap;
  min-width: max-content;
}

.heatmap-grid {
  position: relative;
  height: calc(7 * 18px);
}

.heatmap-cell {
  position: absolute;
  width: 14px;
  height: 14px;
  border-radius: 2px;
  border: 1px solid var(--border-color);
  cursor: pointer;
  transition: all var(--speed);
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    transform: scale(1.2);
    z-index: 10;
    border-color: var(--color);
  }

  &.has-data {
    border-color: var(--red);
  }
}

.burn-count {
  font-size: 9px;
  font-weight: bold;
  color: var(--white);
}

.heatmap-legend {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--size-2);
  margin-top: var(--size-2);

  .legend-label {
    font-size: var(--font-xs);
    color: var(--muted);
  }

  .legend-scale {
    display: flex;
    gap: 2px;
  }

  .legend-cell {
    width: 10px;
    height: 10px;
    background-color: var(--red);
    border-radius: 2px;
    border: 1px solid var(--border-color);
  }
}
</style>
