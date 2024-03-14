<template>
  <div class="auction-wrapper">
    <div class="auction-detail">
      <figure>
        <img :src="auction.image" :alt="auction.title" @click="detail = true">
        <Modal :open="detail" @close="detail = false" modal-classes="extra-wide">
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
            <h1>Bids (<CountDown v-if="until" :until="until" class="inline">
              <template #complete>auction closed</template>
            </CountDown><span v-else>24h</span>)</h1>
            <SignNewBid v-if="ongoing" :auction="auction" @signed="refreshKey++" :min="highestBidAmount + 1" />
          </header>

          <AuctionBidListItem v-for="bid in bids" :key="bid.id" :bid="bid" />
        </section>
      </ClientOnly>
    </div>
  </div>
</template>

<script setup>
import { DateTime } from 'luxon'
import { useMetaData } from '~/helpers/head'
import { useAuctions } from '~/helpers/auctions'

const config = useRuntimeConfig()
const route = useRoute()
const { auctionsById } = useAuctions()
const auction = computed(() => auctionsById.value[route.params.id])

const detail = ref(false)

const bids = ref([])
const earliestBid = ref(null)
const latestBid = ref(null)
const until = computed(() => {
  if (! earliestBid.value || ! latestBid.value) return DateTime.now().plus({ days: 1 }).toUnixInteger()

  const earliestDate = DateTime.fromISO(earliestBid.value?.created_at)
  const latestDate = DateTime.fromISO(latestBid.value?.created_at)

  const earliestEnd = earliestDate.plus({ days: 1 })

  const diff = earliestEnd.diff(latestDate).as('minutes')
  console.log(diff)

  return diff < 10 ? latestDate.plus({ minutes: 10 }).toUnixInteger() : earliestEnd.toUnixInteger()
})

const ongoing = ref(until.value > DateTime.now().toUnixInteger())
watch(until, () => ongoing.value = until.value > DateTime.now().toUnixInteger())

const highestBidAmount = ref(0)

const refreshKey = ref(0)
const url = `${config.public.signatureApi}/signatures`
const query = computed(() => {
  const q = new URLSearchParams({
    'filters[schema]': auction.value.schemaId,
    'limit': '1000',
    // 'filters[object->Auction]': `vv-rare/status`, // TODO: check how we can make this work on the API
  })

  return q.toString()
})
const sortBids = (a, b) => {
  const bidCountA = getBidCount(a)
  const bidCountB = getBidCount(b)

  if (bidCountA > bidCountB) {
    if (bidCountA > highestBidAmount.value) {
      highestBidAmount.value = bidCountA
    }
    return -1
  } else {
    if (bidCountB > highestBidAmount.value) {
      highestBidAmount.value = bidCountB
    }
    return 1
  }
}
const loadBids = async () => {
  const response = await $fetch(`${url}?${query.value}`)

  earliestBid.value = response.data[0]
  latestBid.value = response.data[response.data.length - 1]
  bids.value = response.data.sort(sortBids)
}
onMounted(() => loadBids())
watch(refreshKey, () => loadBids())

const getBidCount = bid => parseInt(JSON.parse(bid.object).Opepen.split(' ')[0])

useMetaData({
  title: `${auction.value.title} | Opepen Auctions`,
  og: auction.value.image,
})
</script>

<style lang="postcss" scoped>
.auction-wrapper {
  padding-left: 0;
  padding-right: 0;
  padding-bottom: 0;
  display: grid;
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
    /* box-shadow: var(--shadow-lg); */
    /* border: 1px solid var(--gray-300); */
    width: 100%;
  }

  @media (--md) {
    border-right: var(--border-dark);
    padding: 0;
    height: 100%;
    display: flex;
    flex-direction: column;
  }
}

.auction-detail > header {
  padding: var(--size-7) 0 0;
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

  @media (--md) {
    margin: 0;

    > * {
      padding: var(--size-5);
    }
  }

  header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--size-5);

    @media (--md) {
      margin-bottom: 0;
      border-bottom: var(--border-dark);
    }
  }

}
</style>
