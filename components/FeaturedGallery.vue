<template>
  <PaginatedContent
    :url="url"
    v-slot="{ items }"
    class="gallery"
  >
    <Image
      v-for="image in items"
      :key="image.uuid"
      :image="image"
      version="sm"
      class="appear up"
    />
  </PaginatedContent>
</template>

<script setup>
const config = useRuntimeConfig()
const url = `${config.public.opepenApi}/opepen/images/featured`
</script>

<style lang="postcss" scoped>
.gallery {
  --image-width: 9rem;
  --gap: var(--size-4);

  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(var(--image-width), 1fr));
  grid-auto-flow: dense;
  gap: var(--gap);

  > *:nth-child(4n) {
    grid-column: span 2;
    grid-row: span 2;
  }

  @media (--sm) {
    --image-width: 12rem;
  }

  @media (--md) {
    --image-width: 15rem;
  }

  @media (--lg) {
    --gap: var(--size-8);
  }
}
</style>
