<template>
  <Modal
    :open="open"
    :click-outside="true"
    @close="$emit('close')"
    modal-classes="image-modal extra-wide"
  >
    <Image
      :image="image"
      :version="isStatic ? 'lg' : version"
      :aspect-ratio="1"
      class="appear"
      auto-embed
    />

    <footer>
      <slot name="footer">
        <div class="text">
          <h1>{{ name }}</h1>
          <p>{{ tagline }}</p>
        </div>
        <Button @click="download">
          <Icon type="download" stroke-width="2" />
          Download
        </Button>
      </slot>
    </footer>
  </Modal>
</template>

<script setup>
import { imageURI } from '~/helpers/images'
import downloadImage from '~/helpers/download-image'

const {
  image,
  open,
  name,
  tagline,
} = defineProps({
  image: Object,
  open: Boolean,
  name: String,
  tagline: String,
})

defineEmits(['close'])

const isStatic = computed(() => ['png', 'jpg', 'jpeg'].includes(image?.type))

const download = async () => {
  const uri = imageURI(image)

  return isStatic.value
    ? downloadImage(uri, { name: name?.value || 'Opepen' })
    : window.open(uri, '_blank')
}
</script>

<style lang="postcss">
.image-modal {
  > section {
    padding: 0 !important;

    > .image > .image {
      border: 0;
      border-bottom-left-radius: 0;
      border-bottom-right-radius: 0;
      border-bottom: var(--border-dark);
    }

    > footer {
      padding: var(--size-4);
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: var(--size-4);

      h1 {
        text-transform: none;
      }

      p {
        font-size: var(--font-sm);
        color: var(--gray-z-7);
      }
    }
  }
}
</style>
