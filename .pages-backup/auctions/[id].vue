<template>
  <div class="auction-wrapper">
    <div class="auction-detail">
      <figure>
        <img :src="auction.image" :alt="auction.title" @click="imageDetailOpen = true">
        <Modal :open="imageDetailOpen" @close="imageDetailOpen = false" modal-classes="extra-wide">
          <img :src="auction.image" :alt="auction.title">
        </Modal>
      </figure>

      <header>
        <h1>{{ auction.title }}</h1>

        <div class="checks">
          <a :href="auction.url" title="View Token" target="_blank">
            <Check :style="{ color: auction.chain === 'btc' ? `#FF9900` : `currentcolor` }" />
          </a>
        </div>
      </header>

      <section class="info">
        <p><strong>Handshake Auction:</strong> Sign your intent to exchange unrevealed Opepen 40-Editions for this Visualize Value 1/1.</p>
        <p><strong>Background:</strong> We’re building up a treasury to compensate artists that contribute to the Opepen Protocol.</p>
      </section>

      <ClientOnly>
        <section class="bids">
          <header>
            <h1>Bids (<CountDown v-if="until" :until="until" class="inline" @complete="onComplete">
              <template #complete>auction closed</template>
            </CountDown><span v-else>24h</span>)</h1>
            <SignNewBid v-if="ongoing" :auction="auction" @signed="loadAuction" :min="highestBidAmount + 1" />
          </header>

          <AuctionBidListItem v-for="bid in bids" :key="bid.id" :bid="bid" />
        </section>
      </ClientOnly>
    </div>
  </div>
</template>

<script setup>
import { useIntervalFn } from '@vueuse/core'
import { DateTime } from 'luxon'
import { useMetaData } from '~/helpers/head'
import { delay } from '~/helpers/time'

const config = useRuntimeConfig()
const route = useRoute()

const auction = ref(null)
const loading = ref(false)
const loadAuction = async () => {
  loading.value = true
  auction.value = await $fetch(config.public.opepenApi + `/auctions/${route.params.id}`)
  loading.value = false
}
await loadAuction()
const { pauses: stopUpdateAuctionInterval } = useIntervalFn(() => loadAuction(), 30_000)

const imageDetailOpen = ref(false)

const bids = computed(() => auction.value?.bids)
const earliestBid = computed(() => auction.value?.earliestBid)
const latestBid = computed(() => auction.value?.latestBid)
const highestBid = computed(() => auction.value?.highestBid)
const highestBidAmount = computed(() => highestBid.value?.bidCount)

const until = computed(() => {
  if (! earliestBid.value || ! latestBid.value) return DateTime.now().plus({ days: 1 }).toUnixInteger()

  const earliestDate = DateTime.fromISO(earliestBid.value?.created_at)
  const latestDate = DateTime.fromISO(highestBid.value?.createdAt)

  const earliestEnd = earliestDate.plus({ days: 1 })

  const diff = earliestEnd.diff(latestDate).as('minutes')

  return diff < 10 ? latestDate.plus({ minutes: 10 }).toUnixInteger() : earliestEnd.toUnixInteger()
})
const computeOngoing = () => until.value > DateTime.now().toUnixInteger()
const ongoing = ref(computeOngoing())
watch(until, () => ongoing.value = computeOngoing())
const onComplete = async () => {
  await loadAuction()
  await delay(100)

  ongoing.value = computeOngoing()

  if (! ongoing.value) {
    stopUpdateAuctionInterval()
  }
}

useMetaData({
  title: `${auction.value.title} | Opepen Auctions`,
  og: auction.value.image,
})
</script>

<style scoped>
.auction-wrapper {
  display: grid;
  padding: var(--navbar-height) 0 0 ;
}

.auction-detail {
  display: grid;
  gap: var(--size-5);
  padding: var(--size-5);
  grid-template-areas:
    'figure'
    'header'
    'info'
    'bids';

  @media (--md) {
    border-top: var(--border-dark);
    height: 100%;
    height: calc(100dvh - var(--navbar-height));
    overflow: hidden;
    padding: 0;
    grid-template-columns: 50% 1fr;
    grid-template-rows: auto auto 1fr;
    grid-template-areas:
      'figure header'
      'figure info'
      'figure bids';
    gap: 0;
  }
}

figure {
  width: 100%;
  align-self: center;
  grid-area: figure;

  img {
    border: var(--border-dark);
    width: 100%;
  }

  @media (--md) {
    border-right: var(--border-dark);
    padding: 0;
    height: 100%;
    display: flex;
    flex-direction: column;

    img {
      border: none;
      border-bottom: var(--border-dark);
    }
  }
}

.auction-detail > header {
  padding: var(--size-3) 0 0;
  display: flex;
  justify-content: space-between;

  h1 {
    font-size: var(--font-xl);
    margin: 0;
    display: flex;
    align-items: center;
  }

  .checks {
    display: flex;
    margin-top: -0.35em;
  }

  svg,
  :deep(svg) {
    width: var(--size-7);
  }

  @media (--md) {
    padding: var(--size-5);
    border-bottom: var(--border-dark);
  }
}

.info {
  grid-area: info;
  display: grid;
  gap: var(--size-4);
  padding: 0 0 var(--size-4);
  border-bottom: var(--border-dark);
  width: 100%;

  @media (--md) {
    padding: var(--size-5);
  }

  @media (--lg) {
    gap: var(--size-7);
    grid-template-columns: 1fr 1fr;
  }

  p {
    color: var(--gray-z-5);
  }

  strong {
    color: var(--gray-z-9);
    text-decoration: underline;
  }
}

.bids {
  grid-area: bids;
  width: 100%;
  margin-bottom: var(--size-8);

  header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--size-5);
    z-index: 1;
  }

  @media (--md) {
    overflow-y: auto;
    -webkit-overflow-scrolling: auto;
    position: relative;
    height: 100%;
    margin: 0;

    > * {
      padding: var(--size-5);
    }

    header {
      margin-bottom: 0;
      border-bottom: var(--border-dark);
      position: sticky;
      top: 0;
      background-color: var(--semi);
      backdrop-filter: var(--blur);
    }
  }

}
</style>
