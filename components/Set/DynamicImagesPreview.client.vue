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
      :name="modalTitle"
      :tagline="modalTagline"
      v-model:open="modalOpen"
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
  let array = []
  const image = data.edition1Image
  if (image) {
    image.edition = 1
    array.push(image)
  }

  for (const edition of EDITIONS) {
    let index = 1
    while (index <= edition) {
      const image = data.dynamicSetImages[`image${edition}_${index}`]
      index ++

      if (! image) continue
      image.edition = edition
      array.push(image)
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
    grid-template-columns: repeat(auto-fill, minmax(7rem, 1fr));
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
