<template>
  <PaginatedContent
    :url="url"
    :query="query"
    tag="section"
    v-slot="{ items }"
  >
    <div class="grid">
      <slot :items="items">
        <Image
          v-for="image in items"
          :key="image.uuid"
          :image="image"
        />
      </slot>
    </div>
    </PaginatedContent>
</template>

<script setup>
const props = defineProps({
  path: String,
})

const config = useRuntimeConfig()
const url = computed(() => `${config.public.opepenApi}/${props.path}`)
</script>

<style lang="postcss" scoped>
section {
  .grid {
    display: grid;
    gap: var(--size-5);
    grid-template-columns: repeat(auto-fill, minmax(8rem, 1fr));

    @media (--md) {
      grid-template-columns: repeat(auto-fill, minmax(18rem, 1fr));
    }
  }
}
</style>
