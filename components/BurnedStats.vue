<template>
  <div v-if="loading" class="loading">Loading...</div>

  <div v-else-if="sortedBurnedStats.length">
    <div>
      <div class="tab-nav">
        <button
          class="tab-button"
          :class="{ active: activeTab === 'sets' }"
          @click="activeTab = 'sets'"
        >
          Sets
        </button>
        <button
          class="tab-button"
          :class="{ active: activeTab === 'accounts' }"
          @click="activeTab = 'accounts'"
        >
          Accounts
        </button>
      </div>

      <div class="tab-content">
        <div v-if="activeTab === 'sets'" class="stats-section">
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

        <div v-if="activeTab === 'accounts'" class="stats-section">
          <Table>
            <tbody>
              <tr v-for="(account, index) in sortedBurnerAccounts" :key="account.id">
                <td class="rank-column">{{ index + 1 }}</td>
                <td>
                  <NuxtLink :to="`/${id(account)}`" class="account-link">
                    <ApiAccount :account="account" hide-avatar hide-address />
                  </NuxtLink>
                </td>
                <td class="amount">{{ account.burnedCount }}</td>
              </tr>
            </tbody>
          </Table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const { setsById } = await useSets()

const burnedData = ref([])
const loading = ref(true)
const activeTab = ref('sets')

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

const sortedBurnerAccounts = computed(() => {
  if (!burnedData.value.length) return []

  const accountMap = new Map()

  burnedData.value.forEach((token) => {
    const account = token.burnerAccount
    if (account) {
      const existing = accountMap.get(account.id)
      if (existing) {
        existing.burnedCount += 1
      } else {
        accountMap.set(account.id, {
          ...account,
          burnedCount: 1,
        })
      }
    }
  })

  return Array.from(accountMap.values()).sort((a, b) => b.burnedCount - a.burnedCount)
})
</script>

<style scoped>
.loading {
  color: var(--muted);
  text-align: center;
  padding: var(--spacer);
}

.tab-nav {
  display: flex;
  margin: 0 auto var(--spacer);
}

.tab-button {
  background: none !important;
  border: none;
  padding: var(--size-3) var(--spacer-lg);
  cursor: pointer;
  color: var(--color);
  position: relative;

  &:after {
    position: absolute;
    height: 3px;
    width: 100%;
    bottom: -1px;
    left: 0;
    content: '';
    background: transparent;
  }

  &.active {
    &:after {
      background: var(--color);
    }
  }
}

.tab-content {
  min-height: 200px;
}

.stats-section {
  h3 {
    margin-bottom: var(--spacer);
    color: var(--color);
    font-size: var(--font-lg);
  }
}

.set-link,
.account-link {
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
  table-layout: fixed;

  .rank-column {
    width: 30px;
    text-align: center;
  }

  td:nth-child(2) {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  td:nth-child(3) {
    width: 20px;
    text-align: right;
    white-space: nowrap;
  }
}
</style>
