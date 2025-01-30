<template>

  <section v-if="data" class="items">
    <SetPreviewImage :data="data" :edition="1" version="" @click="open(1)" />
    <SetPreviewImage :data="data" :edition="4" version="" @click="open(4)" />
    <SetPreviewImage :data="data" :edition="5" version="" @click="open(5)" />
    <SetPreviewImage :data="data" :edition="10" version="" @click="open(10)" />
    <SetPreviewImage :data="data" :edition="20" version="" @click="open(20)" />
    <SetPreviewImage :data="data" :edition="40" version="" @click="open(40)" />

    <ImageModal
      :image="image"
      v-model:open="zoomed"
      :name="name"
      :tagline="tagline"
    />
  </section>

</template>

<script setup>
const { data } = defineProps({ data: Object })

const edition = ref()
const zoomed = ref(false)
const image = computed(() => data[`edition${edition.value}Image`] || DEFAULT_TOKEN_IMAGE)
const name = computed(() => data ? data[`edition${edition.value}Name`] : `Unrevealed`)
const tagline = computed(() => EDITION_TAGLINES[edition.value])

const open = (ed) => {
  edition.value = ed
  zoomed.value = true
}
</script>

<style scoped>
.items {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  grid-template-rows: repeat(3, minmax(0, 1fr));
  gap: var(--size-2);
  grid-auto-flow: dense;

  > :first-child {
    grid-column: span 2;
    grid-row: span 2;
  }

  @media (--md) {
    gap: var(--size-5);
  }
}
</style>

