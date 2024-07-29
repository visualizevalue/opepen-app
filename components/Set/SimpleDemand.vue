<template>
  <p>
    <ClientOnly>
      <SetVisualDemand
        v-if="overallDemand > 0 && overallDemand < 100"
        :data="data"
        :pending-fill="isActive ? `var(--gray-z-1)` : `var(--red)`"
        key="viz-demand"
      />
      <Icon
        v-else
        type="check"
        :style="{
          color: overallDemand === 100
            ? 'var(--green)'
            : overallDemand > 0
              ? 'var(--yellow)'
              : 'inherit'
        }"
      />
    </ClientOnly>
    <span>
      <span>{{ formatNumber(totalEthPrice) }} ETH</span>
      <span class="muted">
        <span>{{ formatNumber(totalUsdPrice) }} USD</span>
        <span class="separator">·</span>
        <span v-if="isRevealed">Consensus met ({{ formatDate(data.reveals_at) }})</span>
        <span v-else-if="overallDemand === 100">Consensus met</span>
        <span v-else-if="isActive">Consensus pending</span>
        <span v-else>Consensus not met</span>
      </span>
    </span>
  </p>
</template>

<script setup>
import { DateTime } from 'luxon'
import { formatEther } from 'viem'
import { useStats } from '~/helpers/stats'
import { formatNumber } from '~/helpers/format'
import { formatDate } from '~/helpers/dates'
import { OPT_IN_HOURS, useNow } from '~/helpers/time'

const props = defineProps({ data: Object })

const isRevealed = computed(() => !! props.data.set)
const now = useNow()
const closesAt = computed(() => props.data.reveals_at
  ? DateTime.fromISO(props.data.reveals_at)
  : DateTime.fromISO(props.data.starred_at).plus({ hours: OPT_IN_HOURS })
)
const isActive = computed(() => now.value < closesAt.value.toUnixInteger())

const minDemand = computed(() => props.data.min_subscription_percentage)
const edition1Demand = computed(() => parseInt(props.data?.submission_stats.demand['1'] * 100 / 1))
const edition4Demand = computed(() => parseInt(props.data?.submission_stats.demand['4'] * 100 / 4))
const edition5Demand = computed(() => parseInt(props.data?.submission_stats.demand['5'] * 100 / 5))
const edition10Demand = computed(() => parseInt(props.data?.submission_stats.demand['10'] * 100 / 10))
const edition20Demand = computed(() => parseInt(props.data?.submission_stats.demand['20'] * 100 / 20))
const edition40Demand = computed(() => parseInt(props.data?.submission_stats.demand['40'] * 100 / 40))

/**
 * The actual demand across the siz edition types. (Can not be greater than 100%)
 */
const overallDemand = computed(() => {
  const max = p => Math.min(p, 100)
  const maxTotal = 6
  const percentages = [
    max(edition1Demand.value),
    max(edition4Demand.value),
    max(edition5Demand.value),
    max(edition10Demand.value),
    max(edition20Demand.value),
    max(edition40Demand.value),
  ]
  const percentage = percentages.reduce((acc, curr) => acc + curr, 0) / maxTotal
  return percentage > 2 ? Math.floor(percentage) : percentage.toFixed(2)
})

const edition1Active = computed(() => minDemand.value && edition1Demand.value >= minDemand.value)
const edition1CloseToActive = computed(() => edition1Demand.value > 0)
const edition4Active = computed(() => minDemand.value && edition4Demand.value >= minDemand.value)
const edition4CloseToActive = computed(() => edition4Demand.value > 0)
const edition5Active = computed(() => minDemand.value && edition5Demand.value >= minDemand.value)
const edition5CloseToActive = computed(() => edition5Demand.value > 0)
const edition10Active = computed(() => minDemand.value && edition10Demand.value >= minDemand.value)
const edition10CloseToActive = computed(() => edition10Demand.value > 0)
const edition20Active = computed(() => minDemand.value && edition20Demand.value >= minDemand.value)
const edition20CloseToActive = computed(() => edition20Demand.value > 0)
const edition40Active = computed(() => minDemand.value && edition40Demand.value >= minDemand.value)
const edition40CloseToActive = computed(() => edition40Demand.value > 0)
const overAllActive = computed(() =>
  edition1Active.value &&
  edition4Active.value &&
  edition5Active.value &&
  edition10Active.value &&
  edition20Active.value &&
  edition40Active.value
)
const overAllCloseToActive = computed(() =>
  edition1CloseToActive.value &&
  edition4CloseToActive.value &&
  edition5CloseToActive.value &&
  edition10CloseToActive.value &&
  edition20CloseToActive.value &&
  edition40CloseToActive.value
)

// Priced Demand
const { data: stats } = await useStats()
const optedOneOfOnePrice = computed(() =>
  BigInt(stats.value.markets.floor.unrevealedEditions['1'] || 0) *
  BigInt(props.data?.submission_stats.demand['1'])
)
const optedOneOfFourPrice = computed(() =>
  BigInt(stats.value.markets.floor.unrevealedEditions['4'] || 0) *
  BigInt(props.data?.submission_stats.demand['4'])
)
const optedOneOfFivePrice = computed(() =>
  BigInt(stats.value.markets.floor.unrevealedEditions['5'] || 0) *
  BigInt(props.data?.submission_stats.demand['5'])
)
const optedOneOfTenPrice = computed(() =>
  BigInt(stats.value.markets.floor.unrevealedEditions['10'] || 0) *
  BigInt(props.data?.submission_stats.demand['10'])
)
const optedOneOfTwentyPrice = computed(() =>
  BigInt(stats.value.markets.floor.unrevealedEditions['20'] || 0) *
  BigInt(props.data?.submission_stats.demand['20'])
)
const optedOneOfFortyPrice = computed(() =>
  BigInt(stats.value.markets.floor.unrevealedEditions['40'] || 0) *
  BigInt(props.data?.submission_stats.demand['40'])
)
const totalPrice = computed(() =>
  optedOneOfOnePrice.value +
  optedOneOfFourPrice.value +
  optedOneOfFivePrice.value +
  optedOneOfTenPrice.value +
  optedOneOfTwentyPrice.value +
  optedOneOfFortyPrice.value
)
const totalEthPrice = computed(() => formatEther(totalPrice.value))
const totalUsdPrice = computed(() => parseInt(totalEthPrice.value * stats.value.ethPrice.USD))
</script>

<style lang="postcss" scoped>
p {
  display: flex;
  align-items: center;
  display: flex;
  gap: var(--size-2);
  line-height: 1;

  .icon {
    display: block;
    width: calc(var(--size-7) + var(--size-2));
    margin-top: calc(-1 * var(--size-1));
  }

  > span {
    display: block;
    line-height: 1;

    > span {
      display: flex;
      flex-wrap: wrap;
      line-height: 1;
      gap: 0 var(--size-1);
      white-space: nowrap;
    }
  }

  .separator {
    display: none;

    @media (--sm) {
      display: block;
    }
  }
}

</style>
