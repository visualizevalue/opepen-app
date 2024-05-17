<template>
  <Loading v-if="loading" />
  <Image v-else-if="isImage" :image="embed.image" />
  <article v-else-if="isVideo || isHLS" class="image loaded">
    <div class="inner image">
      <video :src="videoUrl" playsinline loop autoplay muted ref="video"></video>
    </div>
  </article>
  <article v-else class="embed">
    <Image v-if="embed.image" :image="embed.image" />
    <div v-if="embed.title" class="text">
      <h1>{{ embed.title }}</h1>
      <p v-if="embed.description">{{ embed.description }}</p>
    </div>
    <a v-if="embed.title" :href="embed.url" target="_blank"><span>View {{ embed.title }}</span></a>
  </article>
</template>

<script setup>
import HLS from 'hls.js'

const {
  url,
} = defineProps({
  url: String,
})

const config = useRuntimeConfig()

const embed = ref()
const video = ref()
const isImage = computed(() => embed.value.image && !embed.value.title)
const isVideo = computed(() => [
    '.ogv', '.webm', '.mp4'
  ].findIndex(ending => url.endsWith(ending)) > -1
)
const isHLS = computed(() => url.endsWith('.m3u8'))
const videoUrl = computed(() => {
  if (isVideo.value || !isHLS.value) return url

  if (video.value?.canPlayType('application/vnd.apple.mpegurl')) {
    return url
  }

  if (HLS.isSupported() && video.value) {
    const hls = new HLS()
    hls.loadSource(url)
    hls.attachMedia(video.value)
    return video.value.src
  }

  return url
})

const loading = ref(false)
const load = async () => {
  loading.value = true
  embed.value = await $fetch(`${config.public.opepenApi}/open-graph-data?url=${encodeURI(url)}`)
  loading.value = false
}

onMounted(async () => {
  load()
})
</script>

<style lang="postcss" scoped>
.embed {
  position: relative;
  border: var(--border);
  border-radius: var(--size-4);
  border-top-left-radius: var(--size-1);
  overflow: hidden;

  &.minimal {
    :deep(.image) {
      display: none;
    }
  }

  :deep(.image) {
    border: none;
    border-radius: 0 !important;
  }

  .text {
    padding: var(--size-2) var(--spacer);
    overflow: hidden;

    p {
      color: var(--gray-z-6);
      font-size: var(--font-sm);
    }

    h1,
    p {
      white-space: nowrap;
      width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }

  a {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;

    span {
      opacity: 0;
    }
  }
}
</style>
