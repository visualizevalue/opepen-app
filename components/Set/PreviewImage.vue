<template>
  <div class="preview">
    <Image @click="zoomed = true" :image="image" version="sm" class="appear" :class="{ square: ! set.rounded_preview }" />

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
      <Image :image="image" version="lg" class="appear" />

      <footer>
        <div class="text">
          <h1>{{ name }}</h1>
          <p>{{ tagline }}</p>
        </div>
        <Button @click="download">
          <Icon type="download" stroke-width="2" />
          Download
        </Button>
      </footer>
    </Modal>
  </div>
</template>

<script setup>
import { imageURI } from '~/helpers/images'
import downloadImage from '~/helpers/download-image'
import { EDITION_TAGLINES } from '~/helpers/editions'

const {
  set,
  edition,
} = defineProps({
  set: Object,
  edition: Number
})

const image = computed(() => set[`edition${edition}Image`])
const name = computed(() => set[`edition${edition}Name`])

const tagline = computed(() => EDITION_TAGLINES[edition])

// Modal
const zoomed = ref(false)

const download = async () => {
  const isStatic = ['png', 'jpg', 'jpeg'].includes(image.value?.type)
  const uri = imageURI(image.value)

  return isStatic
    ? downloadImage(uri, { name: name.value })
    : open(uri, '_blank')
}
</script>

<style lang="postcss" scoped>
.preview {
  position: relative;
  overflow: hidden;

  > .image {
    cursor: pointer;
    overflow: hidden;
  }

  .meta {
    user-select: none;
    pointer-events: none;
    font-size: var(--font-sm);
    opacity: 0;
    position: absolute;
    bottom: -1rem;
    left: 0;
    right: 0;
    top: 0;
    min-width: 100%;
    min-height: 100%;
    padding: calc(var(--size-4));
    transition: all var(--speed);
    margin: 0;
    line-height: 1;
    font-weight: var(--font-weight-bold);
    text-transform: uppercase;
    text-shadow: 0 0.1em 0.5em var(--black);
    color: var(--gray-z-8);
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-end;
    border-radius: var(--size-5);
    border-top-left-radius: var(--size-1);
    border: var(--border);

    h1 {
      margin-bottom: var(--size-1);
      font-size: 1rem;
    }

    p {
      color: var(--gray-z-6);
    }

    > * {
      max-width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }

  &:--highlight {
    .meta {
      opacity: 1;
      bottom: -1px;
      background-color: var(--semi);
    }

    > .image :deep(img) {
      transform: scale(1.15);
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

    > footer {
      padding: var(--size-4);
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: var(--size-4);

      p {
        font-size: var(--font-sm);
        color: var(--gray-z-7);
      }
    }
  }
}
</style>
