<template>
  <PageHeader>
    <h1 class="breadcrumb">
      <NuxtLink :to="`/holders/${opepen.owner}`">
        <Icon type="arrow-left" />
        <span>{{ opepen.ownerAccount.display }}</span>
      </NuxtLink>
    </h1>
  </PageHeader>

  <article>
    <div class="image-wrapper">
      <OpepenImage :token="opepen" version="lg" />
      <div class="actions">
        <a :href="`https://opensea.io/assets/ethereum/0x6339e5e072086621540d0362c4e3cea0d643e114/${opepen.token_id}`" target="_blank">
          <IconsOpenSea />
        </a>

        <Button @click="download"><Icon type="download" /> <span>Download</span></Button>
      </div>
    </div>
  </article>
</template>

<script setup>
import { useMetaData } from '~/helpers/head'
import { imageURI } from '~/helpers/images'
import downloadImage from '~/helpers/download-image'

const route = useRoute()
const router = useRouter()
const config = useRuntimeConfig()

if (parseInt(route.params.id) > 16_000) router.replace('/')

const { data: opepen } = await useFetch(`${config.public.opepenApi}/opepen/${route.params.id}`)
if (! opepen) router.replace('/')

const download = async () => {
  const image = opepen.value?.image
  const isStatic = ['png', 'jpg', 'jpeg'].includes(image?.type)
  const uri = imageURI(image)

  return isStatic
    ? downloadImage(uri, { name: `Opepen ${opepen.value.token_id}` })
    : open(uri, '_blank')
}

useMetaData({
  title: `Opepen #${route.params.id}`,
  // og: imageURI(imageData.value, upscaled.value ? 'lg' : undefined)
})
</script>

<style lang="postcss" scoped>
  article {
    display: grid;
    gap: var(--size-4);
    grid-template-columns: 1fr;
    grid-template-rows: auto;
    margin: var(--size-2) 0;

    /* @media (--md) {
      grid-template-columns: 60% 40%;
    } */

    .image-wrapper {
      width: 100%;
      max-width: min(60vh, 80vw);
      max-height: min(60vh, 80vw);

      .actions {
        display: flex;
        align-items: center;
        justify-content: space-between;

        a {
          color: var(--gray-z-5);
          transition: all var(--speed);

          svg {
            width: var(--size-5);
          }

          &:--highlight {
            color: var(--color);
          }
        }
      }
    }
  }
</style>
