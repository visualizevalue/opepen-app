<template>

  <section class="stats">
    <span class="th">Edition</span>
    <span class="th">Holders</span>
    <span class="th">Opt-Ins</span>
    <span class="th">Demand</span>
    <span class="check th"></span>

    <span class="th">One</span>
    <span>{{ formatNumber(data?.submission_stats.holders['1']) }}</span>
    <span>{{ formatNumber(edition1Count) }}</span>
    <span>{{ formatNumber(edition1Demand) }}%</span>
    <span class="check" :class="{
      active: edition1Active,
      closeToActive: edition1CloseToActive,
    }"><Check /></span>

    <span class="th">Four</span>
    <span>{{ formatNumber(data?.submission_stats.holders['4']) }}</span>
    <span>{{ formatNumber(edition4Count) }}</span>
    <span>{{ formatNumber(edition4Demand) }}%</span>
    <span class="check" :class="{
      active: edition4Active,
      closeToActive: edition4CloseToActive,
    }"><Check /></span>

    <span class="th">Five</span>
    <span>{{ formatNumber(data?.submission_stats.holders['5']) }}</span>
    <span>{{ formatNumber(edition5Count) }}</span>
    <span>{{ formatNumber(edition5Demand) }}%</span>
    <span class="check" :class="{
      active: edition5Active,
      closeToActive: edition5CloseToActive,
    }"><Check /></span>

    <span class="th">Ten</span>
    <span>{{ formatNumber(data?.submission_stats.holders['10']) }}</span>
    <span>{{ formatNumber(edition10Count) }}</span>
    <span>{{ formatNumber(edition10Demand) }}%</span>
    <span class="check" :class="{
      active: edition10Active,
      closeToActive: edition10CloseToActive,
    }"><Check /></span>

    <span class="th">Twenty</span>
    <span>{{ formatNumber(data?.submission_stats.holders['20']) }}</span>
    <span>{{ formatNumber(edition20Count) }}</span>
    <span>{{ formatNumber(edition20Demand) }}%</span>
    <span class="check" :class="{
      active: edition20Active,
      closeToActive: edition20CloseToActive,
    }"><Check /></span>

    <span class="th">Forty</span>
    <span>{{ formatNumber(data?.submission_stats.holders['40']) }}</span>
    <span>{{ formatNumber(edition40Count) }}</span>
    <span>{{ formatNumber(edition40Demand) }}%</span>
    <span class="check" :class="{
      active: edition40Active,
      closeToActive: edition40CloseToActive,
    }"><Check /></span>

    <span class="th">Overall</span>
    <span class="th">{{ formatNumber(data?.submission_stats.holders.total) }}
      <small class="muted" v-if="data?.submission_stats.totalHolders">(of {{ formatNumber(data?.submission_stats.totalHolders) }})</small>
    </span>
    <span class="th">{{ formatNumber(totalCount) }} <small class="muted">(of {{ formatNumber(eligibleOpepenCount) }})</small></span>
    <span class="th">
      {{ formatNumber(avgDemand) }}%
      <small class="muted nowrap">(min {{ formatNumber(minDemand) }}%)</small>
    </span>
    <span class="check th" :class="{
      active: overAllActive,
      closeToActive: overAllCloseToActive,
    }"><Check /></span>
  </section>

</template>

<script setup>
import { formatNumber } from '~/helpers/format'
import { useSets } from '~/helpers/sets'

const props = defineProps({ data: Object })
const { publishedSets } = useSets()

// COUNTS
const edition1Count = computed(() => props.data?.submission_stats.opepens['1'])
const edition4Count = computed(() => props.data?.submission_stats.opepens['4'])
const edition5Count = computed(() => props.data?.submission_stats.opepens['5'])
const edition10Count = computed(() => props.data?.submission_stats.opepens['10'])
const edition20Count = computed(() => props.data?.submission_stats.opepens['20'])
const edition40Count = computed(() => props.data?.submission_stats.opepens['40'])
const totalCount = computed(() => props.data?.submission_stats.opepens.total)
const eligibleOpepenCount = computed(() => {
  return 16_000 - 80 * publishedSets.value.length
})

// OVERSUBSCRIBED
const minDemand = computed(() => props.data.min_subscription_percentage)
const edition1Demand = computed(() => parseInt(props.data?.submission_stats.demand['1'] * 100 / 1))
const edition4Demand = computed(() => parseInt(props.data?.submission_stats.demand['4'] * 100 / 4))
const edition5Demand = computed(() => parseInt(props.data?.submission_stats.demand['5'] * 100 / 5))
const edition10Demand = computed(() => parseInt(props.data?.submission_stats.demand['10'] * 100 / 10))
const edition20Demand = computed(() => parseInt(props.data?.submission_stats.demand['20'] * 100 / 20))
const edition40Demand = computed(() => parseInt(props.data?.submission_stats.demand['40'] * 100 / 40))
const avgDemand = computed(() => parseInt((edition1Demand.value +
                                 edition4Demand.value * 4 +
                                 edition5Demand.value * 5 +
                                 edition10Demand.value * 10 +
                                 edition20Demand.value * 20 +
                                 edition40Demand.value * 40) / 80)
)

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

<style scoped>
.stats {
  border-radius: var(--size-6);
  border-top-left-radius: var(--size-1);
  border: var(--border-dark);
  background-color: var(--gray-z-1);
  grid-template-columns: 21.875% 21.875% 21.875% 21.875% 12.5%;
  grid-template-rows: repeat(8, minmax(0, 1fr));
  gap: 0;
  overflow: hidden;
  border-color: var(--gray-z-4);

  > * {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-transform: uppercase;
    font-weight: var(--font-weight-bold);
    font-size: var(--font-sm);
    box-shadow: var(--border-shadow);
    background-color: var(--gray-z-1);
    line-height: var(--line-height-md);
  }

  .nowrap {
    white-space: nowrap;
    flex-direction: row;

    small {
      align-self: baseline;
    }
  }

  .th {
    background-color: var(--gray-z-2);
  }

  .muted {
    color: var(--gray-z-7);
  }

  .check {
    color: var(--gray-z-5);
    width: calc(100% + 1px);

    &.closeToActive {
      color: var(--yellow);
    }

    &.active {
      color: var(--success)
    }

    svg {
      width: var(--size-7);
      height: var(--size-7);
    }
  }
}
</style>
