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
          :to="`https://opensea.io/assets/ethereum/${burned ? burnedContract : contract}/${opepen.token_id}`"
          target="_blank"
        >
          View On OpenSea
        </NuxtLink>
      </li>
      <li>
        <Icon type="etherscan" />
        <NuxtLink
          :href="`https://etherscan.io/nft/${burned ? burnedContract : contract}/${opepen.token_id}`"
          target="_blank"
        >
          View On Etherscan
        </NuxtLink>
      </li>
      <li>
        <Icon type="download-cloud" />
        <template v-if="opepen.image?.type === 'svg'">
          <a :href="pngImage" @click.stop.prevent="downloadPNG" class="no-style">
            Download PNG
          </a>
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
    <div class="burned" v-if="burned">
      <div class="burned-opepen">
        <div class="info">
          <NuxtLink
            :to="`/opepen/${opepen.opepen.token_id}`"
            @click.stop.prevent
            class="title"
          >
            <span>Opepen #{{ opepen.opepen.token_id }}</span>
          </NuxtLink>
          <span>{{ opepen.opepen.name }}</span>
          <span>Burned on {{ formatDate(opepen.burned_at) }}</span>
        </div>
        <Image :image="opepen.opepen.image" />
      </div>
    </div>
  </section>
</template>

<script setup>
const { opepen, burned = false } = defineProps({
  opepen: Object,
  burned: Boolean,
})

const config = useRuntimeConfig()
const contract = config.public.opepenContract
const burnedContract = config.public.burnedOpepenContract

const submission = computed(() => opepen.set?.submission)
const attributes = computed(() =>
  opepen.metadata?.attributes.filter((a) => a.trait_type !== 'Number'),
)

const image = computed(() => imageURI(opepen.image))
const pngImage = computed(() => `https://api.opepen.art/${opepen.token_id}/render`)
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
  if (!burned) {
    return downloadImage(`${config.public.opepenApi}/render/opepen/${opepen.token_id}/og`, {
      name: `Opepen Card ${opepen.token_id}`,
    })
  } else
    return downloadImage(`${config.public.opepenApi}/render/burned/${opepen.token_id}/og`, {
      name: `Burned Opepen Card ${opepen.token_id}`,
    })
}
</script>

<style scoped>
.burned {
  margin-top: var(--spacer);
  padding: var(--size-3);
  border-radius: var(--border-radius);
  background: var(--gray-z-0);

  @media (--md) {
    margin-top: var(--spacer-lg);
    padding: var(--size-6);
  }

  .burned-opepen {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--size-2);
  }

  .info {
    display: flex;
    flex-direction: column;
    gap: var(--size-2);
  }

  span {
    font-family: var(--ui-font-family);
    font-size: var(--ui-font-size);
    color: var(--gray-z-6);
    text-transform: uppercase;
  }

  .title > span {
    font-size: var(--font-lg);
    color: var(--color);
    cursor: pointer;

    &:hover {
      color: var(--gray-z-6);
    }
  }
}
</style>
