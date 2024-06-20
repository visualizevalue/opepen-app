<template>
  <p>
    <Icon
      type="check"
      :style="{
        color: overallDemand === 100
          ? 'var(--green)'
          : overallDemand > 0
            ? 'var(--yellow)'
            : 'inherit'
      }"
    />
    <span v-if="isRevealed">
      <span>Consensus met</span>
      <small class="muted">({{ formatDate(data.reveals_at) }})</small>
    </span>
    <span v-else-if="overallDemand === 100">Demand met</span>
    <span v-else>{{ formatNumber(overallDemand) }}% Demand</span>
  </p>
</template>

<script setup>
import { formatNumber } from '~/helpers/format'
import { formatDate } from '~/helpers/dates'

const props = defineProps({ data: Object })

const isRevealed = computed(() => !! props.data.set)

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
    width: var(--size-5);
  }

  > span {
    display: block;

    > span {
      display: block;
    }
  }
}

</style>
