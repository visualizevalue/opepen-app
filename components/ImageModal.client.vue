<template>
  <Modal
    v-model:open="open"
    class="image-modal extra-wide"
    compat
  >
    <Image
      :image="image"
      :version="isStatic && image.versions.lg ? 'lg' : ''"
      :aspect-ratio="1"
      :key="image?.uuid"
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
          <span>Download</span>
        </Button>
      </slot>
    </footer>
  </Modal>
</template>

<script setup>
const {
  image,
  name,
  tagline,
} = defineProps({
  image: [String, Object],
  name: String,
  tagline: String,
})

const open = defineModel('open', { required: true })

const isStatic = computed(() => ['png', 'jpg', 'jpeg'].includes(image?.type))

const download = async () => {
  const uri = imageURI(image)

  return isStatic.value
    ? downloadImage(uri, { name: name ? `Opepen ${name}` : 'Opepen' })
    : window.open(uri, '_blank')
}
</script>

<style>
.image-modal {
  padding: 0 !important;

  > .image > .image {
    border: 0;
    border-radius: 0 !important;
    border-bottom: var(--border-dark);
  }

  > footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--spacer);
    gap: var(--spacer);

    .text {
      display: grid;
      gap: var(--spacer-xs);
    }

    h1, p {
      @mixin ui-font;
    }

    p {
      font-size: var(--font-sm);
      color: var(--gray-z-6);
    }
  }
}
</style>
