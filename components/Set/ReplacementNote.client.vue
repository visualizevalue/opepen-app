<template>
  <Alert v-if="replacedSubmission" class="note">
    <div class="preview">
      <Image :image="replacedSubmission.edition1Image" version="sm" />
      <Image :image="replacedSubmission.edition4Image" version="sm" />
      <Image :image="replacedSubmission.edition5Image" version="sm" />
      <Image :image="replacedSubmission.edition10Image" version="sm" />
      <Image :image="replacedSubmission.edition20Image" version="sm" />
      <Image :image="replacedSubmission.edition40Image" version="sm" />
    </div>
    <div class="text">
      <h1>Set replaced</h1>
      <p>
        The set below was replaced with the "{{ replacedSubmission.name }}" submission by {{ replacedSubmission.artist }} because the minimum demand threshold was not met.
      </p>
    </div>
  </Alert>
</template>

<script setup>
const props = defineProps({
  set: Object,
  replacedSubmission: Object,
})
</script>

<style lang="postcss" scoped>
.note {
  display: grid;
  grid-template-columns: 5rem 1fr;
  gap: var(--size-4);
  margin: 0;

  @media (--md) {
    gap: var(--size-7);
  }
}

.preview {
  width: 5rem;
  height: 5rem;
  flex-shrink: 0;

  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  grid-template-rows: repeat(3, minmax(0, 1fr));
  gap: var(--size-2);
  grid-auto-flow: dense;

  > :first-child {
    grid-column: span 2;
    grid-row: span 2;
  }

  .image {
    margin: 0;
    height: 100%;
    border-radius: var(--size-0);
  }
}

.text {
  h1 {
    color: var(--gray-z-7);
  }
}
</style>
