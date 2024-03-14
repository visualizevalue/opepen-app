<template>
  <div class="auction-detail">
    <figure>
      <img :src="auction.image" :alt="auction.title">

      <div>
        <h1>{{ auction.title }}</h1>

        <div class="checks">
          <a :href="auction.url" title="View Token" target="_blank">
            <Check />
          </a>
          <!-- <a v-if="auction.btcUrl" :href="auction.btcUrl" title="View Artwork on Bitcoin" target="_blank">
            <Check style="color: #FF9900;" />
          </a> -->
        </div>
      </div>
    </figure>

    <section class="info">
      <p><strong>Handshake Auction #1:</strong> Sign your intent to exchange unrevealed Opepen 40-Editions for the above Visualize Value 1/1.</p>
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
</template>

<script setup>
import { DateTime } from 'luxon'
import { useMetaData } from '~/helpers/head'
import { useAuctions } from '~/helpers/auctions'

const config = useRuntimeConfig()
const route = useRoute()
const { auctionsById } = useAuctions()
const auction = computed(() => auctionsById.value[route.params.id])

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
    'filters[schema]': `2`,
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
.auction-detail {
  max-width: var(--content-width-sm);
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: var(--size-5);
}

figure {
  max-width: var(--content-width-sm);
  align-self: center;

  img {
    box-shadow: var(--shadow-lg);
    border: 1px solid var(--gray-300);
  }

  > div {
    margin: var(--size-7) 0 0;
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
  }

}

.info {
  display: flex;
  flex-direction: column;
  gap: var(--size-4);
  padding: 0 0 var(--size-4);
  border-bottom: var(--border-dark);

  p {
    color: var(--gray-z-5);
  }

  strong {
    color: var(--gray-z-9);
    text-decoration: underline;
  }
}

.bids {
  margin-bottom: var(--size-8);

  header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--size-5);
  }
}
</style>
