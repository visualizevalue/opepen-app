<template>
  <section v-if="data?.dynamicSetImages" class="set-opepen">
    <slot name="header">
      <SectionTitle>Dynamic Images Preview</SectionTitle>
    </slot>
    <div class="list">
      <div
        v-for="image in images"
        :key="image.uuid"
        @click="openModal(image)"
      >
        <Image
          :image="image"
          :version="image.type === 'gif' ? '' : 'sm'"
          :key="image.uuid"
        />
      </div>
    </div>

    <ImageModal
      :key="image?.uuid"
      :image="image"
      :open="modalOpen"
      @close="modalOpen = false"
    >
    </ImageModal>
  </section>
</template>

<script setup>
const { data } = defineProps({
  data: Object,
})

const EDITIONS = [4, 5, 10, 20, 40]
const images = computed(() => {
  const array = [data.edition1Image]

  for (const edition of EDITIONS) {
    let index = 1
    while (index <= edition) {
      const image = data.dynamicSetImages[`image${edition}_${index}`]
      if (image) array.push(image)
      index ++
    }
  }

  return array
})

const image = ref()
const modalOpen = ref(false)
const openModal = (img) => {
  image.value = img
  modalOpen.value = true
}
</script>

<style lang="postcss" scoped>
  .list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(8rem, 1fr));
    container-type: inline-size;
    flex-wrap: wrap;
    margin: 0 auto;
    gap: var(--size-4);

    > div {
      width: 100%;
      cursor: pointer;
    }
  }
</style>
