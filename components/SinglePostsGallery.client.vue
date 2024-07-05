<template>
  <SinglesGallery path="posts/images" :query="query" :image-accessor="post => post.images[0]" :show-empty="showEmpty">
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
    <template #item="{ item, image }">
      <slot name="item" :item="item" :image="image">
        <Image
          @click="$emit('click', item)"
          :image="image"
          version="sm"
          :aspect-ratio="1"
        />
      </slot>
    </template>
  </SinglesGallery>
</template>

<script setup>
const props = defineProps({
  address: String,
  showEmpty: Boolean,
  refreshKey: [Number, String],
})

const query = computed(() => {
  const q = new URLSearchParams()

  q.append('filter[address]', props.address)
  q.append('filter[deleted_at]', 'null')
  q.append('refresh', props.refreshKey)

  return q.toString()
})
</script>

<style lang="postcss" scoped>
</style>
