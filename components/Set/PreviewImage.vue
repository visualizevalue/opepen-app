<template>
  <div class="preview">
    <Image
      :image="image"
      :version="version"
      class="appear"
      :class="{ square: data && ! data.rounded_preview }"
      auto-embed
    >
      <div class="meta">
        <h1>{{ name }}</h1>
        <p>{{ tagline }}</p>
      </div>
      <button @click="zoomed = true" class="hidden-action"><span>Show details</span></button>
    </Image>

    <ImageModal
      :image="image"
      :open="zoomed"
      :name="name"
      :tagline="tagline"
      @close="zoomed = false"
    />
  </div>
</template>

<script setup>
import { imageURI } from '~/helpers/images'
import downloadImage from '~/helpers/download-image'
import { EDITION_TAGLINES } from '~/helpers/editions'

const {
  data,
  edition,
  version,
} = defineProps({
  data: Object,
  edition: Number,
  version: {
    type: String,
    default: 'sm',
  },
})

const image = computed(() => data ? data[`edition${edition}Image`] : `https://opepen.nyc3.cdn.digitaloceanspaces.com/token.svg`)
const name = computed(() => data ? data[`edition${edition}Name`] : `Unrevealed`)

const tagline = computed(() => EDITION_TAGLINES[edition])

// Modal
const zoomed = ref(false)

const isStatic = computed(() => ['png', 'jpg', 'jpeg'].includes(image.value?.type))

const download = async () => {
  const uri = imageURI(image.value)

  return isStatic.value
    ? downloadImage(uri, { name: name.value })
    : open(uri, '_blank')
}
</script>

<style lang="postcss" scoped>
.preview {
  position: relative;
  overflow: hidden;

  > .image {
    cursor: pointer;
    overflow: hidden;
  }

  &:--highlight {
    > .image :deep(img) {
      transform: scale(1.15);
    }
  }
}
</style>
