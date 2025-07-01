<template>
  <div v-if="loading" class="loading">Loading...</div>

  <div v-else-if="sortedBurnedStats.length">
    <Table>
      <tbody>
        <tr v-for="(stat, index) in sortedBurnedStats" :key="stat.setId">
          <td class="rank-column">{{ index + 1 }}</td>
          <td>
            <span v-if="stat.setId === null" class="unrevealed">Unrevealed Opepen</span>
            <NuxtLink v-else :to="`/sets/${stat.setId}`" class="set-link">
              {{ `Set ${stat.setId}, ${stat.setName}` }}
            </NuxtLink>
          </td>
          <td class="amount">{{ stat.count }}</td>
        </tr>
      </tbody>
    </Table>
  </div>
</template>

<script setup>
const { setsById } = await useSets()

const burnedData = ref([])
const loading = ref(true)

onMounted(async () => {
  try {
    burnedData.value = await fetchPaginated(`/opepen/burned`)
  } catch (error) {
    console.error('Failed to fetch burned data:', error)
  } finally {
    loading.value = false
  }
})

const burnedStatsPerSet = computed(() => {
  if (!burnedData.value.length) return new Map()

  const stats = new Map()
  burnedData.value.forEach((token) => {
    const setId = token.opepen?.set_id || null
    stats.set(setId, (stats.get(setId) || 0) + 1)
  })

  return stats
})

const sortedBurnedStats = computed(() => {
  const statsArray = Array.from(burnedStatsPerSet.value.entries()).map(([setId, count]) => ({
    setId,
    count,
    setName: setId ? setsById.value[setId]?.submission?.name : null,
  }))

  return statsArray.sort((a, b) => {
    if (a.count !== b.count) {
      return b.count - a.count
    }
  })
})
</script>

<style scoped>
.loading {
  color: var(--muted);
  text-align: center;
  padding: var(--spacer);
}

.set-link {
  color: var(--color);
  text-decoration: none;
  transition: color var(--speed);

  &:hover {
    color: var(--gray-z-6);
  }
}

.unrevealed {
  color: var(--muted);
}

.amount {
  text-align: right;
}

table {
  width: 100%;

  .rank-column {
    display: table-cell;
    width: auto;
    text-align: center;
  }

  td:nth-child(2) {
    max-width: 200px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  td:nth-child(3) {
    width: auto;
    text-align: right;
    white-space: nowrap;
  }

  @media (--md) {
    td:nth-child(2) {
      width: 100%;
      max-width: none;
    }
  }
}
</style>
