<template>
  <PaginatedContent
    v-if="width > 800"
    :url="url"
    v-slot="{ items }"
    class="gallery"
    :query="`limit=12`"
    :auto-load="false"
  >
    <div
      v-for="image in items"
      :key="image.uuid"
    >
      <Image
        :image="image"
        version="sm"
        class="appear up"
      />
    </div>
  </PaginatedContent>
</template>

<script setup>
import { useWindowSize, useWindowScroll } from '@vueuse/core'

const config = useRuntimeConfig()
const url = `${config.public.opepenApi}/opepen/images/featured`

const { width, height } = useWindowSize()
const { x, y } = useWindowScroll()
</script>

<style lang="postcss" scoped>
.gallery {
  --image-width: 9rem;
  --gap: var(--size-4);

  padding: var(--size-9);
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(var(--image-width), 1fr));
  grid-auto-flow: dense;
  grid-auto-rows: max-content;
  gap: var(--gap);
  pointer-events: none;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;

  > *:nth-child(4n) {
    grid-column: span 2;
    grid-row: span 2;
  }

  > * {
    opacity: 0.1;
  }

  @media (--lg) {
    --gap: var(--size-8);
  }
}
</style>
