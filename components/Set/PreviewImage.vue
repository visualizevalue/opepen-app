<template>
  <div class="preview">
    <Image :image="image" :version="version" class="appear" auto-embed :aspect-ratio="1">
      <div class="meta">
        <h1>{{ name }}</h1>
        <p>{{ tagline }}</p>
      </div>
    </Image>
  </div>
</template>

<script setup>
const { data, edition } = defineProps({
  data: Object,
  edition: Number,
})

const image = computed(() =>
  data
    ? data[`edition${edition}Image`]
    : `https://opepen.nyc3.cdn.digitaloceanspaces.com/token.svg`,
)
const version = computed(() =>
  image.value?.isAnimated || image.value?.isWebRendered ? '' : 'sm',
)

const name = computed(() => (data ? data[`edition${edition}Name`] : `Unrevealed`))
const tagline = computed(() => EDITIONS[edition]?.tagline)
</script>

<style scoped>
.preview {
  position: relative;

  > .image {
    cursor: pointer;
    border-radius: var(--border-radius);

    &.loaded {
      background: var(--background);

      :deep(.image) {
        background: var(--background);
      }
    }

    :deep(.image) {
      border-radius: var(--border-radius);
    }
  }

  &:--highlight {
    > .image :deep(img) {
      transform: scale(1.15);
    }
  }
}
</style>
