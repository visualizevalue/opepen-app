type Auction = {
  id: string
  url: string
  chain?: string
  description: string
  image: string
  title: string
}

type KeyedAuctions = {
  [key: string]: Auction
}

const auctions: Ref<Auction[]> = ref([
  {
    id: 'status',
    url: 'https://foundation.app/@visualizevalue/vvrare/46',
    chain: 'eth',
    image: 'https://visualizevalue.nyc3.cdn.digitaloceanspaces.com/visuals/status.png',
    title: 'Status',
    description: 'Handshake bid on this VV 1/1 with your unrevealed Opepen 40 Editions',
  },
  {
    id: 'btc-check',
    url: 'https://ordinals.com/inscription/18fb527b0c9630357867f52c0f7259944f319cc4a159195dfe7b7de182e3c324i0',
    chain: 'btc',
    image: 'https://djoq6wdtoz1c6.cloudfront.net/content/7a80778090857cc831d1cc42816add13b7d57b28cd6e5170552d13549c7effb4i0',
    title: 'VV Inscriptions - #19510',
    description: 'Handshake bid on this VV 1/1 with your unrevealed Opepen 40 Editions',
  },
])
const auctionsById: ComputedRef<KeyedAuctions> = computed(() => auctions.value?.reduce((obj: KeyedAuctions, auction) => {
  obj[auction.id] = auction
  return obj
}, {}))
const loaded = ref(false)

export function useAuctions() {
  loaded.value = true

  return {
    auctions,
    auctionsById,
    loaded,
  }
}
