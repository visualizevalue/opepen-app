<template>
  <section v-if="data?.dynamicSetImages" class="dynamic-preview">
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
        >
          <div class="meta">
            <h1>{{ data[`edition${image.edition}Name`] }}</h1>
            <p>{{ `Edition 1/${image.edition}` }}</p>
          </div>
          <button @click="zoomed = true" class="hidden-action"><span>Show details</span></button>
        </Image>
      </div>
    </div>

    <ImageModal
      :key="image?.uuid"
      :image="image"
      :open="modalOpen"
      :name="modalTitle"
      :tagline="modalTagline"
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
  const image = data.edition1Image
  image.edition = 1
  const array = [image]

  for (const edition of EDITIONS) {
    let index = 1
    while (index <= edition) {
      const image = data.dynamicSetImages[`image${edition}_${index}`]
      image.edition = edition
      if (image) array.push(image)
      index ++
    }
  }

  return array
})

const image = ref()
const modalTitle = computed(() => data[`edition${image.value?.edition}Name`])
const modalTagline = computed(() => `${data.name} 1/${image.value?.edition}`)
const modalOpen = ref(false)
const openModal = (img) => {
  image.value = img
  modalOpen.value = true
}
</script>

<style scoped>
  .dynamic-preview {
    display: grid;
    gap: var(--spacer);
  }

  .list {
    width: 100%;
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
