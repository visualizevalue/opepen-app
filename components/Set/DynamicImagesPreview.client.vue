<template>
  <SetOpepenGrid v-if="data?.dynamicSetImages">
    <div class="list list-1">
      <SectionTitle>{{ data[`edition1Name`] }} <span class="muted">(1/1)</span></SectionTitle>

      <Image
        :image="data.edition1Image"
        :version="data.edition1Image.type === 'gif' ? '' : 'sm'"
        :key="data.edition1Image.uuid"
      >
        <div class="meta">
          <h1>{{ data[`edition1Name`] }}</h1>
          <p>1/1</p>
        </div>
      </Image>
    </div>

    <div v-for="edition of EDITIONS" class="list" :class="[`list-${edition}`]">
      <SectionTitle>{{ data[`edition${edition}Name`] }} <span class="muted">(1/{{edition}})</span></SectionTitle>
      <Image
        v-for="image of imagesForEdition(edition)"
        :image="image"
        :version="image.type === 'gif' ? '' : 'sm'"
        :key="image.uuid"
          @click="openModal(image)"
      >
        <div class="meta">
          <h1>{{ data[`edition${edition}Name`] }}</h1>
          <p>1/{{ edition }}</p>
        </div>
      </Image>
    </div>

    <ImageModal
      :key="image?.uuid"
      :image="image"
      :name="modalTitle"
      :tagline="modalTagline"
      v-model:open="modalOpen"
    >
    </ImageModal>
  </SetOpepenGrid>
</template>

<script setup>
const { data } = defineProps({
  data: Object,
})

const EDITIONS = [4, 5, 10, 20, 40]
const imagesForEdition = (edition) => {
  let array = []
  let index = 1

  while (index <= edition) {
    const image = data.dynamicSetImages[`image${edition}_${index}`]
    index ++

    if (! image) continue
    image.edition = edition
    array.push(image)
  }

  return array
}

const image = ref()
const modalTitle = computed(() => data[`edition${image.value?.edition}Name`])
const modalTagline = computed(() => `${data.name} 1/${image.value?.edition}`)
const modalOpen = ref(false)
const openModal = (img) => {
  image.value = img
  modalOpen.value = true
}
</script>

