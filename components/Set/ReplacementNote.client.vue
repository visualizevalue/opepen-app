<template>
  <Alert v-if="replacedSubmission" class="note" :class="{ expanded }">
    <div v-if="!expanded" class="collapsed">
      <div class="preview">
        <Image :image="replacedSubmission.edition1Image" version="sm" />
      </div>
      <p>Set "{{ replacedSubmission.name }}" replaced.</p>
    </div>
    <template v-else>
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
    </template>

    <button class="expand" @click="expanded = !expanded"><Icon type="chevron-right" stroke-width="2.75" /></button>
  </Alert>
</template>

<script setup>
const props = defineProps({
  set: Object,
  replacedSubmission: Object,
})

const expanded = ref(false)
</script>

<style lang="postcss" scoped>
.note {
  margin: 0;
  position: relative;

  .collapsed {
    height: var(--size-5);
    display: flex;
    align-items: center;
    gap: var(--size-4);

    .preview {
      display: block;
      width: var(--size-5);
      height: var(--size-5);

      :deep(> .image) {
        height: var(--size-5);
        width: var(--size-5);
      }
    }

    p {

    }
  }
}

.note.expanded {
  display: grid;
  grid-template-columns: 5rem 1fr;
  gap: var(--size-4);

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
  padding-right: var(--size-5);

  h1 {
    color: var(--gray-z-7);
  }
}

.expand {
  position: absolute;
  padding: var(--size-4);
  top: calc(var(--size-0));
  right: var(--size-0);
  transform: rotate(0);
  transition: all var(--speed);
}
.expanded .expand {
  transform: rotate(90deg);
}
</style>
