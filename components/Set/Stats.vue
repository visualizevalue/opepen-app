<template>

  <section class="stats">
    <span>Edition</span>
    <span class="th">Opt-Ins</span>
    <span class="th">Demand <small class="muted">(min {{ minDemand }}%)</small></span>
    <span></span>

    <span class="th">One</span>
    <span>{{ formatNumber(edition1Count) }}</span>
    <span>{{ formatNumber(edition1Demand) }}%</span>
    <span class="check" :class="{
      active: minDemand && edition1Demand >= minDemand,
      closeToActive: minDemand && edition1Demand >= minDemand/2,
    }"><Check /></span>

    <span class="th">Four</span>
    <span>{{ formatNumber(edition4Count) }}</span>
    <span>{{ formatNumber(edition4Demand) }}%</span>
    <span class="check" :class="{
      active: minDemand && edition4Demand >= minDemand,
      closeToActive: minDemand && edition4Demand >= minDemand/2,
    }"><Check /></span>

    <span class="th">Five</span>
    <span>{{ formatNumber(edition5Count) }}</span>
    <span>{{ formatNumber(edition5Demand) }}%</span>
    <span class="check" :class="{
      active: minDemand && edition5Demand >= minDemand,
      closeToActive: minDemand && edition5Demand >= minDemand/2,
    }"><Check /></span>

    <span class="th">Ten</span>
    <span>{{ formatNumber(edition10Count) }}</span>
    <span>{{ formatNumber(edition10Demand) }}%</span>
    <span class="check" :class="{
      active: minDemand && edition10Demand >= minDemand,
      closeToActive: minDemand && edition10Demand >= minDemand/2,
    }"><Check /></span>

    <span class="th">Twenty</span>
    <span>{{ formatNumber(edition20Count) }}</span>
    <span>{{ formatNumber(edition20Demand) }}%</span>
    <span class="check" :class="{
      active: minDemand && edition20Demand >= minDemand,
      closeToActive: minDemand && edition20Demand >= minDemand/2,
    }"><Check /></span>

    <span class="th">Forty</span>
    <span>{{ formatNumber(edition40Count) }}</span>
    <span>{{ formatNumber(edition40Demand) }}%</span>
    <span class="check" :class="{
      active: minDemand && edition40Demand >= minDemand,
      closeToActive: minDemand && edition40Demand >= minDemand/2,
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

// OVERSUBSCRIBED
const minDemand = computed(() => props.set.min_subscription_percentage)
const edition1Demand = computed(() => parseInt(edition1Count.value / 1 * 100))
const edition4Demand = computed(() => parseInt(edition4Count.value / 4 * 100))
const edition5Demand = computed(() => parseInt(edition5Count.value / 5 * 100))
const edition10Demand = computed(() => parseInt(edition10Count.value / 10 * 100))
const edition20Demand = computed(() => parseInt(edition20Count.value / 20 * 100))
const edition40Demand = computed(() => parseInt(edition40Count.value / 40 * 100))

</script>

<style lang="postcss" scoped>
.stats {
  border-radius: var(--size-6);
  border-top-left-radius: var(--size-1);
  border: var(--border-dark);
  background-color: var(--gray-z-1);
  grid-template-columns: 28.5% 28.5% 28.5% 14.5%;
  grid-template-rows: repeat(7, minmax(0, 1fr));
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

  .th{
    background-color: var(--gray-z-2);
  }

  .muted {
    color: var(--gray-z-7);
  }

  .check {
    color: var(--gray-z-5);

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
