<template>

  <section v-if="submission" class="items">
    <SetPreviewImage :data="submission" :edition="1" @click="open(1)" />
    <SetPreviewImage :data="submission" :edition="4" @click="open(4)" />
    <SetPreviewImage :data="submission" :edition="5" @click="open(5)" />
    <SetPreviewImage :data="submission" :edition="10" @click="open(10)" />
    <SetPreviewImage :data="submission" :edition="20" @click="open(20)" />
    <SetPreviewImage :data="submission" :edition="40" @click="open(40)" />

    <ImageModal
      v-model:open="zoomed"
      :image="image"
      :name="name"
      :tagline="tagline"
    />
  </section>

</template>

<script setup lang="ts">
const { submission } = defineProps<{ submission: SetSubmission }>()

const edition: Ref<EditionType> = ref(1)
const zoomed = ref(false)
const image = computed(() => submission[`edition${edition.value}Image`] || DEFAULT_TOKEN_IMAGE)
const name = computed(() => submission ? submission[`edition${edition.value}Name`] : `Unrevealed`)
const tagline = computed(() => EDITIONS[edition.value]?.tagline)

const open = (ed: EditionType) => {
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
  aspect-ratio: 1;

  > :first-child {
    grid-column: span 2;
    grid-row: span 2;
  }

  @media (--md) {
    gap: var(--size-5);
  }
}
</style>

