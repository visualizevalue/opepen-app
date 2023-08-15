<template>
  <PageHeader>
    <h1 class="breadcrumb">
      <NuxtLink :to="`/create/${journey.uuid}`">
        <Icon type="arrow-left" />
        <span>{{ journey.title }}</span>
      </NuxtLink>
    </h1>

    <nav>
      <button @click="aiImage.download" :disabled="upscaling"><Icon type="download" /><span>MD</span></button>
      <button @click="aiImage.downloadHD" :disabled="upscaling"><Icon type="download" /> <span>HD</span></button>
    </nav>
  </PageHeader>

  <div class="image-wrapper">
    <AiImage
      ref="aiImage"
      :ai-image="{...imageData.ai_image, image: imageData}"
      :step="imageData.journeyStep"
      :version="upscaled ? 'lg' : ''"
    >
      <template #overlay="{ loaded }">
        <div v-if="upscaling || ! loaded" class="inner overlay active">
          <Loading v-if="upscaling" txt="Upscaling..." />
          <Loading v-else-if="! loaded" txt="" />
        </div>
        <div v-else></div>
      </template>
    </AiImage>
  </div>
</template>

<script setup>
import { post } from '~/api'
import { useMetaData } from '~/helpers/head'
import { imageURI } from '~/helpers/images'

const route = useRoute()
const router = useRouter()
const config = useRuntimeConfig()

const aiImage = ref(null)

const { data: imageData } = await useFetch(`${config.public.opepenApi}/opepen/images/${route.params.id}`)
if (! imageData) router.replace('/')

const journey = computed(() => imageData.value.ai_image.journeyStep.journey)

// Load high resolution image
const upscaling = ref(false)
const upscaled = ref(!! imageData.value.versions?.lg)
const loadHighRes = async () => {
  try {
    upscaling.value = true
    await post(`${config.public.opepenAiApi}/ai-images/${imageData.value.ai_image.uuid}/upscale`)
    imageData.value.versions.lg = true
    upscaling.value = false
    upscaled.value = true
  } catch (e) {
    // ...
  }
}
onMounted(() => {
  if (! imageData.value.versions?.lg) {
    loadHighRes()
  }
})

// Define metadata
useMetaData({
  title: `Opepen Image of ${journey.value.title}`,
  og: imageURI(imageData.value, upscaled.value ? 'lg' : undefined)
})
</script>

<style lang="postcss" scoped>
</style>
