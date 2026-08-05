<template>
  <section class="items">
    <SetPreviewImage :data="submission" :edition="1" @click="open" />
    <SetPreviewImage :data="submission" :edition="4" @click="open" />
    <SetPreviewImage :data="submission" :edition="5" @click="open" />
    <SetPreviewImage :data="submission" :edition="10" @click="open" />
    <SetPreviewImage :data="submission" :edition="20" @click="open" />
    <SetPreviewImage :data="submission" :edition="40" @click="open" />

    <ImageModal v-model:open="zoomed" :image="image" :name="name" :tagline="tagline" />
  </section>
</template>

<script setup lang="ts">
const { submission } = defineProps<{ submission: SetSubmission }>()

const edition: Ref<EditionType> = ref(1)
const zoomed = ref(false)
// Whichever artwork the cell is currently showing, which may not be the
// edition's default once the viewer has cycled through a dynamic set.
const activeImage = ref()
const image = computed(
  () => activeImage.value || submission[`edition${edition.value}Image`] || DEFAULT_TOKEN_IMAGE,
)
const name = computed(() =>
  submission ? submission[`edition${edition.value}Name`] : `Unrevealed`,
)
const tagline = computed(() => EDITIONS[edition.value]?.tagline)

const open = ({ edition: ed, image: img }: { edition: EditionType; image?: object }) => {
  edition.value = ed
  activeImage.value = img
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
