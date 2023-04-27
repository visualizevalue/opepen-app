<template>
  <PaginatedContent
    :url="url"
    v-slot="{ items }"
    class="featured"
  >
    <Image
      v-for="image in items"
      :key="image.uuid"
      :image="image"
      class="appear"
    />
  </PaginatedContent>
</template>

<script setup>
const config = useRuntimeConfig()
const url = `${config.public.opepenApi}/opepen/images/featured`
</script>

<style lang="postcss">
.featured {
  --image-width: 9rem;
  --gap: var(--size-4);

  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(var(--image-width), 1fr));
  grid-auto-flow: dense;
  gap: var(--gap);

  @media (--sm) {
    --image-width: 12rem;
  }

  @media (--md) {
    --image-width: 15rem;
  }

  @media (--lg) {
    --gap: var(--size-7);
  }
}
</style>
