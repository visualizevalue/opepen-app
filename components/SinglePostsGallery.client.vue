<template>
  <SinglesGallery path="posts/images" :query="query" :image-accessor="post => post.images[0]">
    <template #before="{ items }">
      <slot name="before" :items="items" />
    </template>
    <template #empty>
      <slot name="empty">
        <div class="content">
          <p class="muted">No single posts created</p>
        </div>
      </slot>
    </template>
  </SinglesGallery>
</template>

<script setup>
const props = defineProps({
  address: String
})

const config = useRuntimeConfig()
const query = computed(() => {
  const q = new URLSearchParams()

  q.append('filter[address]', props.address)

  return q.toString()
})
</script>

<style lang="postcss" scoped>
</style>
