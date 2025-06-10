import { formatEther } from 'viem'

type EthPrice = {
  BTC: number // "BTC": 0.0435,
  USD: number // "USD": 2794.92,
  EUR: number // "EUR": 2495.48
}

type Stats = {
  submissions: {
    sets: number
    images: number
  }
  users: {
    permanentArtists: number
    artists: number
    curators: number
    holders: number
    voters: number
    voterPatrons: number
  }
  optIns: number
  optOuts: {
    total: number
    revealed: number
    unrevealed: number
  }
  revealed: {
    opepen: number
    sets: number
  }
  emails: {
    total: number
    verified: number
  }
  votes: number
  markets: {
    floor: {
      total?: string
      unrevealed?: string
      revealed?: string
      unrevealedEditions?: {
        1: string
        4: string
        5: string
        10: string
        20: string
        40: string
      }
    }
    history: {
      totalUSD?: number
      totalETH?: number
    }
  }
  ethPrice?: EthPrice
}

const deployment = DateTime.fromSeconds(1673158871)
const day = Math.abs(Math.floor(deployment.diffNow('days').as('days')))
const stats: Ref<Stats | null> = ref(null)

export const useStats = async () => {
  const { data, refresh, status } = await useApi(`/stats`, {
    immediate: false,
    dedupe: 'defer',
  })

  watchEffect(() => {
    stats.value = data.value as Stats
  })

  if (!stats.value && status.value !== 'pending') {
    await refresh()
  }

  return {
    day,
    stats,
    refresh,
  }
}

export const useSetEthDemand = async (submission: SetSubmission) => {
  const { stats } = await useStats()

  let totalDemand = 0n

  if (stats.value?.markets.floor.unrevealedEditions) {
    for (const edition of EDITION_KEYS) {
      console.log(
        totalDemand,
        edition,
        submission.submission_stats?.demand[edition],
        formatEther(BigInt(stats.value.markets.floor.unrevealedEditions[edition])),
      )
      totalDemand +=
        BigInt(submission.submission_stats?.demand[edition] || 0) *
        BigInt(stats.value.markets.floor.unrevealedEditions[edition])
    }
  }

  return {
    wei: totalDemand,
    eth: formatEther(totalDemand),
  }
}
