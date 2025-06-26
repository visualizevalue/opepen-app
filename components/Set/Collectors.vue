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
              <td class="rank-column"></td>
              <td></td>
              <td class="opt-ins-column">Opt Ins</td>
              <td v-if="submission.set_id > 10" class="max-reveals-column">Max Reveals</td>
              <td class="holdings-column">Holdings</td>
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
              <td class="opt-ins-column">
                {{ dataLoading ? '...' : collector.subscriptions }}
              </td>
              <td v-if="submission.set_id > 10" class="max-reveals-column">
                {{ dataLoading ? '...' : collector.maxReveals }}
              </td>
              <td class="holdings-column">{{ collector.count }}</td>
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
const dataLoading = ref(true)

const collectorsWithStats = computed(() => {
  if (!collectors.value.length) return []

  return collectors.value.map((account) => ({
    account,
    count: account.opepen_count || 0,
    subscriptions: account.total_opt_ins || 0,
    maxReveals: account.total_max_reveals || 0,
  }))
})

const displayedCollectors = computed(() =>
  collectorsWithStats.value.slice(0, showAll.value ? Infinity : 10),
)

const showMoreButton = computed(() => !showAll.value && collectorsWithStats.value.length > 10)

const showLess = () => {
  showAll.value = false
}

const downloadCSV = async (type) => {
  try {
    if (type === 'holders') {
      const addresses = collectors.value.map((collector) => collector.address)
      downloadCsv(addresses, `set-${submission.set_id}-holders.csv`)
    } else {
      const subscribers = await fetchPaginated(
        `/set-submissions/${submission.uuid}/subscribers`,
      )
      const addresses = subscribers.map((subscriber) => subscriber.address)
      downloadCsv(addresses, `set-${submission.set_id}-opt-ins.csv`)
    }
  } catch (error) {
    console.error('Failed to download CSV:', error)
  }
}

onMounted(async () => {
  try {
    const nodeStatsResponse = await $fetch(
      `${config.public.opepenApi}/set-submissions/${submission.uuid}/nodes-stats`,
    )
    collectors.value = nodeStatsResponse || []
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
    display: none;

    @media (--md) {
      display: block;
      color: var(--muted);
      font-family: var(--ui-font-family);
      font-size: var(--ui-font-size);
      font-weight: var(--ui-font-weight);
      text-transform: var(--ui-text-transform);
      letter-spacing: var(--ui-letter-spacing);
      line-height: var(--ui-line-height);
    }
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

  .rank-column {
    display: table-cell;
    width: auto;
    text-align: center;
  }

  .opt-ins-column,
  .max-reveals-column {
    display: none;
  }

  .holdings-column {
    width: auto;
    text-align: right;
  }

  @media (--md) {
    .rank-column {
      display: table-cell;
      width: auto;
      text-align: center;
    }

    td:nth-child(2) {
      width: 100%;
    }

    .opt-ins-column,
    .max-reveals-column {
      display: table-cell;
      width: auto;
      text-align: right;
    }
  }
}
</style>
