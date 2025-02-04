<template>
  <SinglesGallery path="posts/images" :query="query" :image-accessor="post => post.images[0]" :show-empty="showEmpty">
    <template #before="{ items }">
      <slot name="before" :items="items" />

      <ImageModal
        :key="image?.uuid"
        :image="image"
        :open="modalOpen"
        @close="modalOpen = false"
      />
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
          @click="clickImage(image)"
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

const emit = defineEmits(['click'])

const query = computed(() => {
  const q = new URLSearchParams()

  q.append('filter[address]', props.address)
  q.append('filter[deleted_at]', 'null')
  q.append('refresh', props.refreshKey)

  return q.toString()
})

const image = ref()
const modalOpen = ref(false)
const openModal = (img) => {
  image.value = img
  modalOpen.value = true
}
const clickImage = (img) => {
  openModal(img)
  emit('click', img)
}
</script>

<style scoped>
</style>
