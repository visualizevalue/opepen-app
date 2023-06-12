<template>

  <section class="stats">
    <span>Edition</span>
    <span class="th">Opt-Ins</span>
    <span class="th">Demand <small class="muted">(min {{ formatNumber(minDemand) }}%)</small></span>
    <span class="check"></span>

    <span class="th">One</span>
    <span>{{ formatNumber(edition1Count) }}</span>
    <span>{{ formatNumber(edition1Demand) }}%</span>
    <span class="check" :class="{
      active: edition1Active,
      closeToActive: edition1CloseToActive,
    }"><Check /></span>

    <span class="th">Four</span>
    <span>{{ formatNumber(edition4Count) }}</span>
    <span>{{ formatNumber(edition4Demand) }}%</span>
    <span class="check" :class="{
      active: edition4Active,
      closeToActive: edition4CloseToActive,
    }"><Check /></span>

    <span class="th">Five</span>
    <span>{{ formatNumber(edition5Count) }}</span>
    <span>{{ formatNumber(edition5Demand) }}%</span>
    <span class="check" :class="{
      active: edition5Active,
      closeToActive: edition5CloseToActive,
    }"><Check /></span>

    <span class="th">Ten</span>
    <span>{{ formatNumber(edition10Count) }}</span>
    <span>{{ formatNumber(edition10Demand) }}%</span>
    <span class="check" :class="{
      active: edition10Active,
      closeToActive: edition10CloseToActive,
    }"><Check /></span>

    <span class="th">Twenty</span>
    <span>{{ formatNumber(edition20Count) }}</span>
    <span>{{ formatNumber(edition20Demand) }}%</span>
    <span class="check" :class="{
      active: edition20Active,
      closeToActive: edition20CloseToActive,
    }"><Check /></span>

    <span class="th">Forty</span>
    <span>{{ formatNumber(edition40Count) }}</span>
    <span>{{ formatNumber(edition40Demand) }}%</span>
    <span class="check" :class="{
      active: edition40Active,
      closeToActive: edition40CloseToActive,
    }"><Check /></span>

    <span class="th">Overall</span>
    <span class="th">{{ formatNumber(totalCount) }}</span>
    <span class="th">
      {{ formatNumber(avgDemand) }}%
      <!-- <small>(<abbr title="average" class="muted">avg.</abbr>)</small> -->
    </span>
    <span class="check th" :class="{
      active: overAllActive,
      closeToActive: overAllCloseToActive,
    }"><Check /></span>
  </section>

</template>

<script setup>
import { formatNumber } from '~/helpers/format'

const props = defineProps({ set: Object })

// COUNTS
const edition1Count = computed(() => props.set?.submitted_opepen['1']?.length)
const edition4Count = computed(() => props.set?.submitted_opepen['4']?.length)
const edition5Count = computed(() => props.set?.submitted_opepen['5']?.length)
const edition10Count = computed(() => props.set?.submitted_opepen['10']?.length)
const edition20Count = computed(() => props.set?.submitted_opepen['20']?.length)
const edition40Count = computed(() => props.set?.submitted_opepen['40']?.length)
const totalCount = computed(() => edition1Count.value +
                                  edition4Count.value +
                                  edition5Count.value +
                                  edition10Count.value +
                                  edition20Count.value +
                                  edition40Count.value
)

// OVERSUBSCRIBED
const minDemand = computed(() => props.set.min_subscription_percentage)
const edition1Demand = computed(() => parseInt(edition1Count.value / 1 * 100))
const edition4Demand = computed(() => parseInt(edition4Count.value / 4 * 100))
const edition5Demand = computed(() => parseInt(edition5Count.value / 5 * 100))
const edition10Demand = computed(() => parseInt(edition10Count.value / 10 * 100))
const edition20Demand = computed(() => parseInt(edition20Count.value / 20 * 100))
const edition40Demand = computed(() => parseInt(edition40Count.value / 40 * 100))
const avgDemand = computed(() => parseInt((edition1Demand.value +
                                 edition4Demand.value +
                                 edition5Demand.value +
                                 edition10Demand.value +
                                 edition20Demand.value +
                                 edition40Demand.value) / 6)
)

const edition1Active = computed(() => minDemand.value && edition1Demand.value >= minDemand.value)
const edition1CloseToActive = computed(() => minDemand.value && edition1Demand.value >= minDemand.value / 2)
const edition4Active = computed(() => minDemand.value && edition4Demand.value >= minDemand.value)
const edition4CloseToActive = computed(() => minDemand.value && edition4Demand.value >= minDemand.value / 2)
const edition5Active = computed(() => minDemand.value && edition5Demand.value >= minDemand.value)
const edition5CloseToActive = computed(() => minDemand.value && edition5Demand.value >= minDemand.value / 2)
const edition10Active = computed(() => minDemand.value && edition10Demand.value >= minDemand.value)
const edition10CloseToActive = computed(() => minDemand.value && edition10Demand.value >= minDemand.value / 2)
const edition20Active = computed(() => minDemand.value && edition20Demand.value >= minDemand.value)
const edition20CloseToActive = computed(() => minDemand.value && edition20Demand.value >= minDemand.value / 2)
const edition40Active = computed(() => minDemand.value && edition40Demand.value >= minDemand.value)
const edition40CloseToActive = computed(() => minDemand.value && edition40Demand.value >= minDemand.value / 2)
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
.stats {
  border-radius: var(--size-6);
  border-top-left-radius: var(--size-1);
  border: var(--border-dark);
  background-color: var(--gray-z-1);
  grid-template-columns: 37.5% 25% 25% 12.5%;
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
