<template>
  <PaginatedContent
    v-if="address"
    :url="url"
    :query="query"
  >
  <template #after-block="{ items }">
    <slot v-if="! items.length" name="empty" :items="items">
      <div>
        <p class="muted">No single posts created</p>
      </div>
    </slot>
  </template>
  <template #default="{ items }">
    <slot name="before"></slot>
    <div class="list">
      <article v-for="post in items" :key="post.id">
          <Image :image="post.images[0]" />
        </article>
      </div>
    </template>
  </PaginatedContent>
</template>

<script setup>
const props = defineProps({
  address: String
})

const config = useRuntimeConfig()
const url = `${config.public.opepenApi}/posts/images`
const query = computed(() => {
  const q = new URLSearchParams()

  q.append('filter[address]', props.address)

  return q.toString()
})
</script>

<style lang="postcss" scoped>
.list {
  display: grid;
  gap: var(--size-5);
  grid-template-columns: repeat(auto-fill, minmax(13rem, 1fr));
}
</style>
