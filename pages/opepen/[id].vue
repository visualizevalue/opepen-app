<template>
  <PageFrameSm>
    <OpepenVisual :token="opepen" :version="version" />
  </PageFrameSm>
</template>

<script setup>
const route = useRoute()
const config = useRuntimeConfig()

const { data: opepen } = await useFetch(`${config.public.opepenApi}/opepen/${route.params.id}`)

const version = computed(() => {
  if (opepen.value.image?.versions['lg']) return 'lg'

  return null
})

// const metadata = computed(() => opepen.metadata)
// const image = computed(() => imageURI(opepen.value.image))
// const download = async () => {
//   const isStatic = ['png', 'jpg', 'jpeg'].includes(opepen.value.image?.type)
//
//   if (metadata.value?.download_url) {
//     return open(normalizeURI(metadata.value.download_url), '_blank')
//   }
//
//   // Force update the image (in the background)
//   fetch(`${config.public.opepenApi}/opepen/${route.params.id}/image`, { method: 'POST' })
//
//   return isStatic
//     ? downloadImage(image.value, { property: `Opepen ${opepen.value.token_id}` })
//     : open(image.value, '_blank')
// }
// const downloadStatsCard = async () => {
//   return downloadImage(`${config.public.opepenApi}/render/opepen/${opepen.value.token_id}/og`, { property: `Opepen Card ${opepen.value.token_id}` })
// }

useMetaData({
  title: `Opepen #${route.params.id}`,
  og: `${config.public.opepenApi}/render/opepen/${route.params.id}/og`,
})
</script>

