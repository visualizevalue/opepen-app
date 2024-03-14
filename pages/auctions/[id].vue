<template>
  <div class="auction-detail">
    <figure>
      <img :src="auction.image" :alt="auction.title">

      <h1>{{ auction.title }}</h1>
    </figure>

    <section class="info">
      <p><strong>Handshake Auction #1:</strong> Sign your intent to exchange unrevealed Opepen 40-Editions for the above Visualize Value 1/1.</p>
      <p><strong>Background:</strong> We’re building up a treasury to compensate artists that contribute to the Opepen Protocol.</p>
    </section>

    <section class="bids">
      <header>
        <h1>Bids</h1>
        <SignNewBid :auction="auction" @signed="refreshKey++" />
      </header>

      <ClientOnly>
        <PaginatedContent :url="url" :query="query" :refresh-key="refreshKey" :item-sorter="itemSorter">
          <template v-slot="{ items }">
            <AuctionBidListItem v-for="item in items" :key="item.id" :bid="item" />
          </template>
        </PaginatedContent>
      </ClientOnly>
    </section>
  </div>
</template>

<script setup>
import { useMetaData } from '~/helpers/head'
import { useAuctions } from '~/helpers/auctions'

const config = useRuntimeConfig()
const route = useRoute()
const { auctionsById } = useAuctions()
const auction = computed(() => auctionsById.value[route.params.id])

const refreshKey = ref(0)
const url = `${config.public.signatureApi}/signatures`
const query = computed(() => {
  const q = new URLSearchParams({
    'filters[schema]': `2`,
    'sort': '-object',
    'limit': '1000',
    // 'filters[object->Auction]': `vv-rare/status`, // TODO: check how we can make this work on the API
  })

  return q.toString()
})
const getBidCount = bid => parseInt(JSON.parse(bid.object).Opepen.split(' ')[0])
const itemSorter = (a, b) => getBidCount(a) > getBidCount(b) ? -1 : 1

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

  h1 {
    font-size: var(--font-xl);
    margin: var(--size-7) 0 0;
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
