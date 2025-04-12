<template>
  <section>
    <DescriptionList>
      <li v-if="submission">
        <Icon type="opepen" stroke-width="2.25" />
        <NuxtLink :to="`/${submission.creator}`">Created by {{ submission.artist }}</NuxtLink>
      </li>
      <li>
        <Icon type="user" stroke-width="2.25" />
        <NuxtLink :to="`/${id(opepen.ownerAccount)}`">
          Owned by
          <ApiAccount :account="opepen.ownerAccount" hide-avatar hide-address />
        </NuxtLink>
      </li>
      <li v-if="submission">
        <Icon type="opepen-grid" />
        <NuxtLink :to="`/sets/${pad(submission.set_id)}`">
          Set "{{ submission.name }}"
        </NuxtLink>
      </li>
      <li v-if="opepen.data?.edition">
        <Icon type="divide-square" />
        <span>Edition one of {{ getEditionName(opepen.data.edition) }}</span>
      </li>
      <li v-if="submission">
        <Icon type="calendar" stroke-width="2.25" />
        <span>Consensus met on {{ formatDate(submission.reveals_at) }}</span>
      </li>
      <li>
        <Icon type="opensea" />
        <NuxtLink
          :to="`https://opensea.io/assets/ethereum/${contract}/${opepen.token_id}`"
          target="_blank"
        >
          View On OpenSea
        </NuxtLink>
      </li>
      <li>
        <Icon type="etherscan" />
        <NuxtLink
          :href="`https://etherscan.io/nft/${contract}/${opepen.token_id}`"
          target="_blank"
        >
          View On Etherscan
        </NuxtLink>
      </li>
      <li>
        <Icon type="download-cloud" />
        <template v-if="opepen.image?.type === 'svg'">
          <a href="#" @click.stop.prevent="downloadPNG" class="no-style">Download PNG</a>
          <Separator />
          <a href="#" @click.stop.prevent="openSVG" class="no-style">SVG</a>
        </template>
        <template v-else>
          <a href="#" @click.stop.prevent="download" class="no-style">Download Visual</a>
        </template>
        <Separator />
        <a href="#" @click.stop.prevent="downloadStatsCard" class="no-style">Info Card</a>
      </li>
    </DescriptionList>
  </section>
</template>

<script setup>
const { opepen } = defineProps({ opepen: Object })

const config = useRuntimeConfig()
const contract = config.public.opepenContract

const submission = computed(() => opepen.set?.submission)
const attributes = computed(() =>
  opepen.metadata?.attributes.filter((a) => a.trait_type !== 'Number'),
)

const image = computed(() => imageURI(opepen.image))
const pngImage = computed(() => imageURI(opepen.image, "lg"))
const download = async () => {
  const isStatic = ['png', 'jpg', 'jpeg'].includes(opepen.image?.type)

  if (opepen.metadata?.download_url) {
    return open(normalizeURI(opepen.metadata.download_url), '_blank')
  }

  // Force update the image (in the background)
  fetch(`${config.public.opepenApi}/opepen/${opepen.token_id}/image`, {
    method: 'POST',
  })

  return isStatic
    ? downloadImage(image.value, { name: `Opepen ${opepen.token_id}` })
    : open(image.value, '_blank')
}
const downloadPNG = () => downloadImage(pngImage.value, { name: `Opepen ${opepen.token_id}` })
const openSVG = () => open(image.value, '_blank')
const downloadStatsCard = async () => {
  return downloadImage(`${config.public.opepenApi}/render/opepen/${opepen.token_id}/og`, {
    name: `Opepen Card ${opepen.token_id}`,
  })
}
</script>
