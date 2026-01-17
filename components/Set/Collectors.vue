<template>
  <section class="collectors">
    <Card class="static">
      <header>
        <SectionTitle>Collectors</SectionTitle>
        <div class="header-buttons">
          <Button :disabled="optInsLoading" @click="downloadOptInsCSV" class="small">
            {{ optInsLoading ? 'Loading...' : 'Opt-In CSV' }}
          </Button>
          <Button :disabled="holdersLoading" @click="downloadHoldersCSV" class="small">
            {{ holdersLoading ? 'Loading...' : 'Holders CSV' }}
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

      <header v-if="contenderData.length">
        <SectionTitle>Full Set Contenders</SectionTitle>
      </header>

      <div v-if="contenderData.length" class="contender-container">
        <Table>
          <thead>
            <tr>
              <td></td>
              <td v-for="edition in EDITIONS" :key="`h-${edition}`" class="edition-column">{{ edition }}</td>
            </tr>
          </thead>
          <tbody>
            <tr v-for="contender in contenderData" :key="contender.account.id">
              <td class="holder-column">
                <NuxtLink :to="`/${id(contender.account)}`" class="collector-info">
                  <Avatar :account="contender.account" />
                  <span class="name">{{ contender.account.display }}</span>
                </NuxtLink>
              </td>
              <td
                v-for="edition in EDITIONS"
                :key="`${contender.account.id}-${edition}`"
                class="edition-column"
                :class="{
                  'is-missing': contender.editions[edition] === 0 && contender.missingCount > 0,
                  'is-complete': contender.missingCount === 0
                }"
              >
                {{ contender.editions[edition] }}
              </td>
            </tr>
          </tbody>
        </Table>
      </div>
    </Card>
  </section>
</template>

<script setup>
import { useAsyncState } from '@vueuse/core'

const { submission } = defineProps({
  submission: Object,
})

const config = useRuntimeConfig()

const EDITIONS = [1, 4, 5, 10, 20, 40]

const showAll = ref(false)
const collectors = ref([])
const opepen = ref([])
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

const { isLoading: optInsLoading, execute: downloadOptInsCSV } = useAsyncState(
  async () => await downloadCSV('opt-ins'),
  null,
  {
    immediate: false,
    onError: (e) => console.error('CSV download failed:', e),
  },
)

const { isLoading: holdersLoading, execute: downloadHoldersCSV } = useAsyncState(
  async () => await downloadCSV('holders'),
  null,
  {
    immediate: false,
    onError: (e) => console.error('CSV download failed:', e),
  },
)

const contenderData = computed(() => {
  if (!collectors.value.length || !opepen.value.length) return []

  const editionMap = {}
  opepen.value.forEach((token) => {
    const address = token.owner_address || token.owner?.address || token.address || token.owner
    const edition = token.data?.edition || token.edition

    if (!address || !edition || !EDITIONS.includes(edition)) return

    if (!editionMap[address]) {
      editionMap[address] = { 1: 0, 4: 0, 5: 0, 10: 0, 20: 0, 40: 0 }
    }
    editionMap[address][edition]++
  })

  const contendersWithEditions = collectors.value
    .map((collector) => {
      const editions = editionMap[collector.address] || { 1: 0, 4: 0, 5: 0, 10: 0, 20: 0, 40: 0 }
      const ownedEditions = EDITIONS.filter((edition) => editions[edition] > 0)
      const missingCount = 6 - ownedEditions.length

      return {
        account: collector,
        editions,
        missingCount,
      }
    })
    .filter((contender) => contender.missingCount <= 3) // Only show 0-3 missing

  contendersWithEditions.sort((a, b) => {
    if (a.missingCount !== b.missingCount) {
      return a.missingCount - b.missingCount
    }
    const aTotal = EDITIONS.reduce((sum, ed) => sum + a.editions[ed], 0)
    const bTotal = EDITIONS.reduce((sum, ed) => sum + b.editions[ed], 0)
    return bTotal - aTotal
  })

  return contendersWithEditions
})

const fullSetHolders = computed(() => {
  return contenderData.value.filter((contender) => contender.missingCount === 0)
})

onMounted(async () => {
  try {
    const [nodeStatsResponse, opepenResponse] = await Promise.all([
      $fetch(`${config.public.opepenApi}/set-submissions/${submission.uuid}/nodes-stats`),
      $fetch(`${config.public.opepenApi}/opepen/sets/${submission.set_id}/opepen`)
    ])
    collectors.value = nodeStatsResponse || []
    opepen.value = opepenResponse || []
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

.contender-container {
  table thead td {
    color: var(--white) !important;
    padding-bottom: var(--size-2);
  }

  .holder-column {
    min-width: 60px;
    max-width: 100px;
    padding-right: var(--spacer-sm);

    @media (--md) {
      min-width: 150px;
      max-width: none;
      padding-right: var(--spacer);
    }
  }

  .collector-info {
    display: flex;
    align-items: center;
    gap: var(--size-2);
    text-decoration: none;
    color: var(--color);
    transition: color var(--speed);

    &:hover {
      color: var(--gray-z-6);
    }

    .avatar {
      width: var(--size-4);
      height: var(--size-4);
      flex-shrink: 0;
    }

    .name {
      font-size: var(--font-sm);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;

      @media (--md) {
        font-size: var(--font-md);
      }
    }
  }

  .edition-column {
    width: 60px;
    text-align: right;
    padding: var(--size-1) 0;
    color: var(--muted);

    &.is-missing {
      color: var(--red);
    }

    &.is-complete {
      color: var(--green);
    }
  }
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
