<template>
  <div class="set">
    <SetPagination :set="set" />

    <section class="items">
      <Image :image="set?.edition1Image" version="sm" class="appear" />
      <Image :image="set?.edition4Image" version="sm" class="appear" />
      <Image :image="set?.edition5Image" version="sm" class="appear" />
      <Image :image="set?.edition10Image" version="sm" class="appear" />
      <Image :image="set?.edition20Image" version="sm" class="appear" />
      <Image :image="set?.edition40Image" version="sm" class="appear" />
    </section>

    <section class="stats">
      <span>Edition</span>
      <span class="light">Opt-Ins</span>
      <span class="light">Demand <small class="muted">(min {{ minDemand }}%)</small></span>
      <span></span>

      <span class="light">One</span>
      <span>{{ edition1Count }}</span>
      <span>{{ edition1Demand }}%</span>
      <span class="check" :class="{ active: minDemand && edition1Demand >= minDemand }"><Check /></span>

      <span class="light">Four</span>
      <span>{{ edition4Count }}</span>
      <span>{{ edition4Demand }}%</span>
      <span class="check" :class="{ active: minDemand && edition4Demand >= minDemand }"><Check /></span>

      <span class="light">Five</span>
      <span>{{ edition5Count }}</span>
      <span>{{ edition5Demand }}%</span>
      <span class="check" :class="{ active: minDemand && edition5Demand >= minDemand }"><Check /></span>

      <span class="light">Ten</span>
      <span>{{ edition10Count }}</span>
      <span>{{ edition10Demand }}%</span>
      <span class="check" :class="{ active: minDemand && edition10Demand >= minDemand }"><Check /></span>

      <span class="light">Twenty</span>
      <span>{{ edition20Count }}</span>
      <span>{{ edition20Demand }}%</span>
      <span class="check" :class="{ active: minDemand && edition20Demand >= minDemand }"><Check /></span>

      <span class="light">Forty</span>
      <span>{{ edition40Count }}</span>
      <span>{{ edition40Demand }}%</span>
      <span class="check" :class="{ active: minDemand && edition40Demand >= minDemand }"><Check /></span>
    </section>

    <section v-if="minDemand" class="opt-in">
      <div>Opt-In window <span class="hidden-sm">for "{{ set.name }}"&nbsp;</span>closes in <CountDown :until="1683046800" minimal class="inline nowrap" />.</div>
      <Button @click="optInOpen = true">
        <Icon type="feather" />
        <span class="nowrap">Opt-In</span>
      </Button>
      <SetOptInFlow
        :set="set"
        :open="optInOpen"
        @close="optInOpen = false"
        :click-outside="false"
      />
    </section>
  </div>
</template>

<script setup>
import { useMetaData } from '~/helpers/head'
import pad from '~/helpers/pad'

const config = useRuntimeConfig()

const route = useRoute()
const setId = parseInt(route.params.id)

const url = `${config.public.opepenApi}/opepen/sets/${setId}`
const { data: set, refresh } = await useFetch(url)

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
  og: 'https://opepen.art/og/rare.png',
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
                "opt-in"
                "details"
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
                  "opt-in opt-in"
                  "leaderboard leaderboard";
    }

    .pagination { grid-area: pagination; }
    .items { grid-area: items; }
    .opt-in { grid-area: opt-in; }
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
    font-family: var(--font-family-display);
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
      box-shadow: 0 0 0 1px var(--gray-z-4);
      background-color: var(--gray-z-1);
      line-height: var(--line-height-md);
    }

    .light{
      background-color: var(--gray-z-2);

    }

    .muted {
      color: var(--gray-z-7);
    }

    .check {
      color: var(--gray-z-5);

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
    font-family: var(--font-family-display);
    display: flex;
    justify-content: space-between;
    align-items: center;

    > div {
      font-weight: var(--font-weight-bold);
      font-size: var(--font-sm);
      text-transform: uppercase;
      letter-spacing: var(--letter-spacing-md);
    }
  }

</style>
