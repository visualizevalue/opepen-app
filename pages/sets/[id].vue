<template>
  <div class="set">
    <SetPagination :set="set" />

    <!-- TODO: Refactor... -->
    <section class="items">
      <SetPreviewImage :set="set" :edition="1" />
      <SetPreviewImage :set="set" :edition="4" />
      <SetPreviewImage :set="set" :edition="5" />
      <SetPreviewImage :set="set" :edition="10" />
      <SetPreviewImage :set="set" :edition="20" />
      <SetPreviewImage :set="set" :edition="40" />
    </section>

    <section class="stats">
      <span>Edition</span>
      <span class="th">Opt-Ins</span>
      <span class="th">Demand <small class="muted">(min {{ minDemand }}%)</small></span>
      <span></span>

      <span class="th">One</span>
      <span>{{ edition1Count }}</span>
      <span>{{ edition1Demand }}%</span>
      <span class="check" :class="{
        active: minDemand && edition1Demand >= minDemand,
        closeToActive: minDemand && edition1Demand >= minDemand/2,
      }"><Check /></span>

      <span class="th">Four</span>
      <span>{{ edition4Count }}</span>
      <span>{{ edition4Demand }}%</span>
      <span class="check" :class="{
        active: minDemand && edition4Demand >= minDemand,
        closeToActive: minDemand && edition4Demand >= minDemand/2,
      }"><Check /></span>

      <span class="th">Five</span>
      <span>{{ edition5Count }}</span>
      <span>{{ edition5Demand }}%</span>
      <span class="check" :class="{
        active: minDemand && edition5Demand >= minDemand,
        closeToActive: minDemand && edition5Demand >= minDemand/2,
      }"><Check /></span>

      <span class="th">Ten</span>
      <span>{{ edition10Count }}</span>
      <span>{{ edition10Demand }}%</span>
      <span class="check" :class="{
        active: minDemand && edition10Demand >= minDemand,
        closeToActive: minDemand && edition10Demand >= minDemand/2,
      }"><Check /></span>

      <span class="th">Twenty</span>
      <span>{{ edition20Count }}</span>
      <span>{{ edition20Demand }}%</span>
      <span class="check" :class="{
        active: minDemand && edition20Demand >= minDemand,
        closeToActive: minDemand && edition20Demand >= minDemand/2,
      }"><Check /></span>

      <span class="th">Forty</span>
      <span>{{ edition40Count }}</span>
      <span>{{ edition40Demand }}%</span>
      <span class="check" :class="{
        active: minDemand && edition40Demand >= minDemand,
        closeToActive: minDemand && edition40Demand >= minDemand/2,
      }"><Check /></span>
    </section>

    <SetItemsMeta :set="set" />
    <SetStatsMeta :set="set" />

    <section v-if="set.name" class="opt-in">
      <div>Opt-In window <span class="hidden-sm">for "{{ set.name }}"&nbsp;</span>closes in <CountDown :until="revealsAt" class="inline nowrap" />.</div>
      <SetOptInFlow
        :set="set"
        :open="optInOpen"
        @close="optInOpen = false"
        :click-outside="false"
      />
      <Button @click="optInOpen = true">
        <Icon type="feather" />
        <span class="nowrap">Opt-In</span>
      </Button>
    </section>
  </div>
</template>

<script setup>
import { DateTime } from 'luxon'
import { useMetaData } from '~/helpers/head'
import pad from '~/helpers/pad'

const config = useRuntimeConfig()

const route = useRoute()
const setId = parseInt(route.params.id)

const url = `${config.public.opepenApi}/opepen/sets/${setId}`
const { data: set, refresh } = await useFetch(url)

const revealsAt = computed(() => DateTime.fromISO(set.value?.reveals_at).toUnixInteger())

// COUNTS
const edition1Count = computed(() => set.value?.submitted_opepen['1']?.length)
const edition4Count = computed(() => set.value?.submitted_opepen['4']?.length)
const edition5Count = computed(() => set.value?.submitted_opepen['5']?.length)
const edition10Count = computed(() => set.value?.submitted_opepen['10']?.length)
const edition20Count = computed(() => set.value?.submitted_opepen['20']?.length)
const edition40Count = computed(() => set.value?.submitted_opepen['40']?.length)

// OVERSUBSCRIBED
const minDemand = computed(() => set.value.min_subscription_percentage)
const edition1Demand = computed(() => parseInt(edition1Count.value / 1 * 100))
const edition4Demand = computed(() => parseInt(edition4Count.value / 4 * 100))
const edition5Demand = computed(() => parseInt(edition5Count.value / 5 * 100))
const edition10Demand = computed(() => parseInt(edition10Count.value / 10 * 100))
const edition20Demand = computed(() => parseInt(edition20Count.value / 20 * 100))
const edition40Demand = computed(() => parseInt(edition40Count.value / 40 * 100))

const optInOpen = ref(false)
watch(optInOpen, () => {
  if (optInOpen.value === false) refresh()
})

useMetaData({
  title: `Set ${pad(set.value.id, 3)}: ${set.value.name || 'Locked'} | Opepen`,
  description: `Opepen Set ${pad(set.value.id, 3)} is one of 200 official Opepen sets.`,
  og: set.value.name
    ? `https://opepen.nyc3.cdn.digitaloceanspaces.com/OG/sets/${pad(set.value.id, 3)}.png`
    : `https://opepen.art/og/rare.png`,
})
</script>

<style lang="postcss" scoped>
  .set {
    display: grid;
    gap: var(--size-4);
    row-gap: var(--size-7);
    max-width: var(--content-width);
    margin: 0 auto;
    grid-template-columns: 100%;
    grid-template-areas:
                "pagination"
                "items"
                "items-meta"
                "opt-in"
                "details"
                "details-meta"
                "leaderboard";

    @media (--md) {
      display: grid;
      gap: var(--size-7);
      row-gap: var(--size-8);
      grid-template-columns: repeat(2, minmax(0, 1fr));
      grid-auto-rows: min-content;
      grid-auto-flow: dense;
      grid-template-areas:
                  "pagination pagination"
                  "items details"
                  "items-meta details-meta"
                  "opt-in opt-in"
                  "leaderboard leaderboard";
    }

    .pagination { grid-area: pagination; }
    .items { grid-area: items; }
    .opt-in { grid-area: opt-in; }
    .items-meta { grid-area: items-meta; }
    .details-meta { grid-area: details-meta; }
  }

  .items,
  .stats {
    display: grid;
    aspect-ratio: 1;
  }

  .items {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    grid-template-rows: repeat(3, minmax(0, 1fr));
    gap: var(--size-2);
    grid-auto-flow: dense;

    > :first-child {
      grid-column: span 2;
      grid-row: span 2;
    }
  }

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

  .opt-in {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--size-2) var(--size-2) var(--size-2) var(--size-4);
    border: var(--border);
    border-radius: var(--size-5);
    border-top-left-radius: var(--size-1);
    background-color: var(--gray-z-0);

    > div {
      font-weight: var(--font-weight-bold);
      font-size: var(--font-sm);
      text-transform: uppercase;
      letter-spacing: var(--letter-spacing-md);
    }
  }

</style>
