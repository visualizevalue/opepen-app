<template>
  <Modal v-model:open="open" class="image-modal extra-wide" compat>
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
        <div v-if="isSVG" class="download-buttons">
          <Button @click="downloadSVG">
            <Icon type="download" stroke-width="2" />
            <span>Download SVG</span>
          </Button>
          <Button @click="downloadPNG">
            <Icon type="download" stroke-width="2" />
            <span>Download PNG</span>
          </Button>
        </div>
        <Button v-else @click="download">
          <Icon type="download" stroke-width="2" />
          <span>Download</span>
        </Button>
      </slot>
    </footer>
  </Modal>
</template>

<script setup>
const { image, name, tagline } = defineProps({
  image: [String, Object],
  name: String,
  tagline: String,
})

const config = useRuntimeConfig()

const open = defineModel('open', { required: true })

const isStatic = computed(() => ['png', 'jpg', 'jpeg'].includes(image?.type))
const isSVG = computed(() => image?.type === 'svg')

const downloadSVG = async () => {
  const uri = imageURI(image)
  window.open(uri, '_blank')
}

const downloadPNG = async () => {
  const uri = `${config.public.opepenApi}/opepen/images/${image.uuid}/render`
  await downloadImage(uri, { name: name ? `Opepen ${name}` : 'Opepen' })
}

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

    h1,
    p {
      @mixin ui-font;
    }

    p {
      font-size: var(--font-sm);
      color: var(--gray-z-6);
    }

    .download-buttons {
      display: flex;
      gap: var(--size-2);
      flex-wrap: wrap;
    }
  }
}
</style>
