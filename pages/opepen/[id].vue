<template>
  <div class="opepen-page">
    <div class="inner">
      <OpepenDetail :opepen="opepen" />

      <div class="actions">
        <a :href="`https://opensea.io/assets/ethereum/${contract}/${opepen.token_id}`" target="_blank">
          <Icon type="opensea" />
        </a>
        <a :href="`https://etherscan.io/nft/${contract}/${opepen.token_id}`" target="_blank">
          <IconsEtherscan />
        </a>

        <div>
          <Button @click="download"><Icon type="download" /> <span>Opepen</span></Button>
          <Button @click="downloadStatsCard"><Icon type="download" /> <span>Card</span></Button>
        </div>
      </div>

      <div>
        <OpepenEvents :token="opepen" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { useMetaData } from '~/helpers/head'
import { imageURI } from '~/helpers/images'
import { normalizeURI } from '~/helpers/urls'
import downloadImage from '~/helpers/download-image'

const route = useRoute()
const router = useRouter()
const config = useRuntimeConfig()
const contract = config.public.opepenContract

if (parseInt(route.params.id) > 16_000) router.replace('/')

const { data: opepen } = await useFetch(`${config.public.opepenApi}/opepen/${route.params.id}`)

const metadata = computed(() => opepen.metadata)
const image = computed(() => imageURI(opepen.value.image))
const download = async () => {
  const isStatic = ['png', 'jpg', 'jpeg'].includes(opepen.value.image?.type)

  if (metadata.value?.download_url) {
    return open(normalizeURI(metadata.value.download_url), '_blank')
  }

  // Force update the image (in the background)
  fetch(`${config.public.opepenApi}/opepen/${route.params.id}/image`, { method: 'POST' })

  return isStatic
    ? downloadImage(image.value, { property: `Opepen ${opepen.value.token_id}` })
    : open(image.value, '_blank')
}
const downloadStatsCard = async () => {
  return downloadImage(`${config.public.opepenApi}/render/opepen/${opepen.value.token_id}/og`, { property: `Opepen Card ${opepen.value.token_id}` })
}

useMetaData({
  title: `Opepen #${route.params.id}`,
  og: `${config.public.opepenApi}/render/opepen/${route.params.id}/og`,
})
</script>

<style lang="postcss" scoped>
  .opepen-page {
    min-height: 100dvh;
    padding: var(--navbar-height) 0 0;

    .inner {
      max-width: 69rem;
      margin: 0 auto;

      .opepen-detail {
        border-top: 0;
        border-left: 0;
        border-right: 0;

        @media (min-width: 69.001rem) {
          border-top: var(--border);
          border-left: var(--border);
          border-right: var(--border);
        }
      }

      > *:not(.opepen-detail) {
        padding-left: var(--size-5);
        padding-right: var(--size-5);
      }

      @media (min-width: 69rem) {
        margin: var(--size-8) auto;

        > *:not(.opepen-detail) {
          padding-left: 0;
          padding-right: 0;
        }
      }
    }
  }

  .actions,
  .actions > div {
    display: flex;
    gap: var(--size-4);
    align-items: center;
  }

  .actions {
    padding: var(--size-4) 0;

    .icon {
      width: var(--size-5);
    }
  }

  .actions > div {
    margin-left: auto;
  }
</style>
