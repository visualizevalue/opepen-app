<template>
  <div class="preview">
    <Image @click="zoomed = true" :image="image" version="sm" class="appear" />
    <div class="meta">
      <h1>{{ name }}</h1>
      <p>{{ tagline }}</p>
    </div>

    <Modal
      :open="zoomed"
      :click-outside="true"
      @close="() => zoomed = false"
      modal-classes="preview-modal wide"
    >
      <Image :image="image" class="appear" />

      <div class="text">
        <h1>{{ name }}</h1>
        <p>{{ tagline }}</p>
      </div>
    </Modal>
  </div>
</template>

<script setup>
const {
  set,
  edition,
} = defineProps({
  set: Object,
  edition: Number
})

const image = computed(() => set[`edition${edition}Image`])
const name = computed(() => set[`edition${edition}Name`])

const taglines = {
  '1': 'One of One',
  '4': 'Four Editions',
  '5': 'Five Editions',
  '10': 'Ten Editions',
  '20': 'Twenty Editions',
  '40': 'Forty Editions',
}
const tagline = computed(() => taglines[edition])

// Modal
const zoomed = ref(false)
</script>

<style lang="postcss" scoped>
.preview {
  position: relative;

  > .image {
    cursor: pointer;
  }

  .meta {
    user-select: none;
    font-size: var(--font-sm);
    opacity: 0;
    position: absolute;
    bottom: var(--size-1);
    left: var(--size-4);
    transition: all var(--speed);
    margin: 0;
    line-height: 1;
    font-weight: var(--font-weight-bold);
    text-transform: uppercase;
    text-shadow: 0 0.1em 0.5em var(--black);
    color: var(--white);

    h1 {
      margin-bottom: var(--size-1);
      font-size: 1rem;
    }

    p {
      color: var(--gray-700);
    }
  }

  &:--highlight {
    .meta {
      opacity: 1;
      bottom: var(--size-3);
    }
  }
}
</style>

<style lang="postcss">
.preview-modal {
  > section {
    padding: 0 !important;

    > .image {
      border-bottom-left-radius: 0;
      border-bottom-right-radius: 0;
      border: 0;
      border-bottom: var(--border-dark);
    }

    .text {
      padding: var(--size-4);

      p {
        font-size: var(--font-sm);
        color: var(--gray-z-7);
      }
    }
  }
}
</style>
