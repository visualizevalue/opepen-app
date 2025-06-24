<template>
  <section class="collectors">
    <Card class="static">
      <header>
        <SectionTitle>Collectors</SectionTitle>
        <div class="header-buttons">
          <Button @click="downloadCSV('opt-ins')" class="small">Opt-In CSV</Button>
          <Button v-if="submission.set_id" @click="downloadCSV('holders')" class="small">
            Holders CSV
          </Button>
        </div>
      </header>
      <p v-if="submission.set_id < 11">Opt-in history of the early sets can be incomplete</p>

      <div class="collector-container">
        <Table>
          <thead>
            <tr>
              <td></td>
              <td></td>
              <td>Opt Ins</td>
              <td v-if="submission.set_id > 10">Max Reveals</td>
              <td>Holdings</td>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(collector, index) in displayedCollectors" :key="collector.account.id">
              <td class="rank-column">{{ index + 1 }}</td>
              <td>
                <NuxtLink :to="`/${id(collector.account)}`" class="collector-info">
                  <Avatar :account="collector.account" />
                  <span class="name">{{ collector.account.display }}</span>
                </NuxtLink>
              </td>
              <td>{{ dataLoading ? '...' : collector.subscriptions }}</td>
              <td v-if="submission.set_id > 10">
                {{ dataLoading ? '...' : collector.maxReveals }}
              </td>
              <td>{{ collector.count }}</td>
            </tr>
          </tbody>
        </Table>

        <Button v-if="showMoreButton" @click="showAll = true" class="toggle-list-button">
          Show More
        </Button>

        <Button v-else @click="showLess" class="toggle-list-button">Show Less</Button>
      </div>
    </Card>
  </section>
</template>

<script setup>
const { submission } = defineProps({
  submission: Object,
})

const config = useRuntimeConfig()

const showAll = ref(false)
const collectors = ref([])
const historyData = ref([])
const subscribersData = ref([])
const dataLoading = ref(true)

const subscriberStats = computed(() => {
  if (!historyData.value.length || !subscribersData.value.length) return {}

  const optIns = {}
  historyData.value.forEach((record) => {
    const address = record.address.toLowerCase()
    if (!optIns[address]) optIns[address] = new Set()

    record.opepen_ids?.forEach((id) => {
      if (record.is_opt_in) {
        optIns[address].add(id)
      } else {
        optIns[address].delete(id)
      }
    })
  })

  const stats = {}

  Object.entries(optIns).forEach(([address, ids]) => {
    stats[address] = { optIns: ids.size, maxReveals: 0 }
  })

  subscribersData.value.forEach((subscriber) => {
    const address = subscriber.address.toLowerCase()
    const reveals = Object.values(subscriber.max_reveals || {}).reduce((a, b) => a + b, 0)

    if (stats[address]) {
      stats[address].maxReveals = reveals
    }
  })

  return stats
})

const collectorsWithStats = computed(() => {
  if (!collectors.value.length) return []

  return collectors.value.map((account) => {
    const address = account.address?.toLowerCase()
    const stats = subscriberStats.value[address] || { optIns: 0, maxReveals: 0 }

    return {
      account,
      count: account.opepen_count || 0,
      subscriptions: stats.optIns,
      maxReveals: stats.maxReveals,
    }
  })
})

const displayedCollectors = computed(() =>
  collectorsWithStats.value.slice(0, showAll.value ? Infinity : 10),
)

const showMoreButton = computed(() => !showAll.value && collectorsWithStats.value.length > 10)

const showLess = () => {
  showAll.value = false
}

const downloadCSV = (type) => {
  const data = type === 'holders' ? collectors.value : subscribersData.value
  if (!data?.length) return

  const addresses = data.map((item) => item.address)
  downloadCsv(addresses, `set-${submission.set_id}-${type}.csv`)
}

onMounted(async () => {
  try {
    const collectorsResponse = await $fetch(
      `${config.public.opepenApi}/opepen/sets/${submission.set_id}/collectors`,
    )
    collectors.value = collectorsResponse

    const [history, subscribers] = await Promise.all([
      fetchPaginated(`/set-submissions/${submission.uuid}/history`),
      fetchPaginated(`/set-submissions/${submission.uuid}/subscribers`),
    ])

    historyData.value = history
    subscribersData.value = subscribers
  } catch (error) {
    console.error('Failed to fetch data:', error)
  } finally {
    dataLoading.value = false
  }
})
</script>

<style scoped>
.static {
  gap: var(--spacer);

  > header {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .header-buttons {
      display: none;

      @media (--md) {
        display: flex;
        gap: var(--size-2);
        flex-direction: row;

        .button {
          width: auto;
          white-space: nowrap;
        }
      }
    }
  }

  > p {
    color: var(--muted);
    font-family: var(--ui-font-family);
    font-size: var(--ui-font-size);
    font-weight: var(--ui-font-weight);
    text-transform: var(--ui-text-transform);
    letter-spacing: var(--ui-letter-spacing);
    line-height: var(--ui-line-height);
  }
}

.collector-info {
  display: flex;
  align-items: center;
  gap: var(--size-2);
  text-decoration: none;
  color: inherit;

  &:hover {
    .name {
      color: var(--gray-z-6);
    }
  }

  .avatar {
    width: var(--size-4);
    height: var(--size-4);
  }

  .name {
    font-size: var(--font-sm);
    color: var(--color);
    transition: color var(--speed);
  }
}

.toggle-list-button {
  margin-top: var(--size-3);
}

table {
  width: 100%;

  td:nth-child(1) {
    display: table-cell;
    width: auto;
    text-align: center;
  }

  td:nth-child(2) {
    width: 100%;
  }

  td:nth-child(3),
  td:nth-child(4) {
    display: none;
  }
  td:nth-child(5) {
    width: auto;
    text-align: right;
  }

  @media (--md) {
    td:nth-child(3),
    td:nth-child(4) {
      display: table-cell;
      width: auto;
      text-align: right;
    }
  }
}
</style>
