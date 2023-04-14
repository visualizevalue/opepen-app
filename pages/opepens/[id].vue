<template>
  <div class="scroll">
    <div>
      <AiImage :image="image" :step="image.journeyStep" :version="upscaled ? 'lg' : ''">
        <template #before="{ download, downloadHD }">
          <PageHeader>
            <h1 class="breadcrumb">
              <NuxtLink :to="`/create/${journey.uuid}`">
                <Icon type="arrow-left" />
                <span>{{ journey.title }}</span>
              </NuxtLink>
            </h1>

            <nav>
              <button @click="download" :disabled="upscaling"><Icon type="download" /><span>MD</span></button>
              <button @click="downloadHD" :disabled="upscaling"><Icon type="download" /> <span>HD</span></button>
            </nav>
          </PageHeader>
        </template>
        <template #overlay="{ loaded }">
          <div v-if="upscaling || ! loaded" class="inner overlay active">
            <Loading v-if="upscaling" txt="Upscaling..." />
            <Loading v-else-if="! loaded" txt="" />
          </div>
          <div v-else></div>
        </template>
      </AiImage>
    </div>
  </div>
</template>

<script setup>
import { post } from '~/api'
import { useMetaData } from '~/helpers/head'
import { delay } from '~/helpers/time'

const route = useRoute()
const router = useRouter()
const config = useRuntimeConfig()

const uri = `${config.public.opepenApi}/ai-images/${route.params.id}`
const { data: image } = await useFetch(uri)
if (! image) router.replace('/')

const journey = computed(() => image.value.journeyStep.journey)

// Load high resolution image
const upscaling = ref(false)
const upscaled = ref(!! image.value.versions?.lg)
const loadHighRes = async () => {
  upscaling.value = true
  await post(`${uri}/upscale`)
  image.value.versions.lg = true
  upscaling.value = false
  await delay(200)
  upscaled.value = true
}
onMounted(() => {
  if (! image.value.versions?.lg) {
    loadHighRes()
  }
})

// Define metadata
useMetaData({
  title: `Opepen Image of ${journey.value.title}`,
  og: upscaled.value ? image.value.uri.replace(`.png`, `@lg.png`) : image.value.uri
})
</script>

<style lang="postcss" scoped>
div.scroll {
  padding: 0 var(--size-4);

  > * {
    max-width: var(--content-width);
    width: 100%;
    margin: 0 auto;

    > header {
      margin: var(--size-5) auto;
      display: flex;
      align-items: center;
      justify-content: space-between;

      h1 {
        flex-shrink: 1;
        padding-right: var(--size-4);
      }

      h1 a {
        width: 100%;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;

        .icon,
        .vue-feather {
          flex-shrink: 0;
        }
      }

      > nav {
        display: flex;
        flex-shrink: 0;
        gap: var(--size-4);
      }
    }
  }
}
</style>
