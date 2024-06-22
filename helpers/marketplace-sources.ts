const CONTRACT = `0x6339e5e072086621540d0362c4e3cea0d643e114`
const SOURCES: { [key: string]: string } = {
  'magiceden.io': `https://magiceden.io/item-details/ethereum/${CONTRACT}/{{ID}}`,
  'opensea.io': `https://opensea.io/assets/ethereum/${CONTRACT}/{{ID}}`,
  'blur.io': `https://blur.io/eth/asset/${CONTRACT}/{{ID}}`,
  'default': `https://opensea.io/assets/ethereum/${CONTRACT}/{{ID}}`,
}

export const marketplaceUri = (key: string, id: number) => {
  let source = SOURCES[key]

  if (! source) {
    source = SOURCES['default']
  }

  return source.replace(`{{ID}}`, `${id}`)
}
