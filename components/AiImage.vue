<template>
  <article class="ai-image" :class="{ loaded }">
    <div class="inner image">
      <!-- TODO: Add preview image (SVG outline) -->
      <!-- <div v-if="!loaded && previewTokenUrl" class="preview">
        <img :src="previewTokenUrl" crossorigin="anonymous" loading="eager" >
      </div> -->
      <img
        v-if="uri"
        ref="imageEl"
        :src="uri"
        loading="lazy"
        @load="imageLoaded"
      >
      <img
        v-if="version"
        :src="versionedUri"
        loading="lazy"
      >
    </div>
    <slot name="overlay" :loaded="loaded">
      <div v-if="loaded" class="inner overlay">
        <nav class="top">
          <!-- <button><Icon type="arrow-up-left" :stroke-width="2.5" /></button> -->
          <button @click="detach"><Icon type="x" :stroke-width="2.5" /></button>
          <NuxtLink :to="`/opepen/${image.uuid}`" class="button"><Icon type="maximize" :stroke-width="3" class="wide" /></NuxtLink>
        </nav>
        <nav class="centered">
          <!-- <button><Icon type="check" stroke-width="2" /></button> -->
          <button @click="reseed"><Icon type="refresh-cw" stroke-width="2" /></button>
          <button @click="download"><Icon type="download" stroke-width="2" /></button>
        </nav>
      </div>
      <div v-else class="inner">
        <Loading txt="" />
      </div>
    </slot>
  </article>
</template>

<script setup>
import { post } from '~/api'
import downloadImage from '~/helpers/download-image'
import { imageURI } from '~/helpers/images'

const config = useRuntimeConfig()

const props = defineProps({
  step: Object,
  aiImage: Object,
  version: String,
})
const emit = defineEmits(['created', 'detach'])

const aiImage = ref(props.aiImage)
const imageEl = ref(null)
const loaded = ref(false)
const uri = ref('')
const image = computed(() => aiImage.value?.image)
const versionedUri = computed(() => imageURI(image.value, props.version))
const loadImage = () => uri.value = imageURI(image.value)

// Load image
// FIXME: This has nothing to do here. extract to journey step...
onMounted(async () => {
  if (! aiImage.value.uuid) {
    aiImage.value = await post(`${config.public.opepenAiApi}/steps/${props.step.uuid}/dream`)

    emit('created', aiImage.value)
  }

  loadImage()
})

// Image loaded event
const imageLoaded = () => loaded.value = true

// Actions
const reseed = async () => {
  try {
    loaded.value = false
    aiImage.value = await post(`${config.public.opepenAiApi}/ai-images/${aiImage.value.uuid}/reseed`)
    uri.value += `?v=${Date.now()}`
    // Image will reload and call loaded event
  } catch (e) {
    loaded.value = true
  }
}
const detach = async () => {
  if (! confirm(`Do you really want to delete this image?`)) return

  $fetch(`${config.public.opepenAiApi}/ai-images/${aiImage.value.uuid}`, {
    method: 'DELETE',
    credentials: 'include',
  })
  emit('detach', aiImage.value)
}
const download = async () => await downloadImage(versionedUri.value, { name: props.version ? `${aiImage.value.uuid}@${props.version}` : aiImage.value.uuid })
const downloadHD = async () => await downloadImage(imageURI(aiImage.value.image, 'xl'), { name: `${aiImage.value.uuid}@xl` })

defineExpose({
  download,
  downloadHD,
})
</script>

<style lang="postcss">
article.ai-image {
  overflow: hidden;
  background-color: var(--gray-z-3);
  border: 1px solid var(--gray-z-4);
  border-radius: var(--size-5);
  border-top-left-radius: var(--size-1);

  position: relative;
  height: 0;
  padding-bottom: 100%;

  .inner {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .image {
    img {
      position: absolute;
      top: 0;
      left: 0;
    }
  }

  .overlay {
    &:after {
      content: '';
      position: absolute;
      z-index: 1;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(to bottom, var(--gray-z-3), var(--gray-z-5));
      opacity: 0.01;
      transition: all var(--speed);
      z-index: 1;
    }

    nav {
      position: absolute;
      z-index: 2;
      display: flex;
      gap: var(--size-2);
      pointer-events: none;
      opacity: 0;
      transform: all var(--speed);

      &.top {
        top: var(--size-3);
        right: var(--size-3);

        .icon,
        .vue-feather {
          width: var(--size-5);
          height: var(--size-5);
        }

        button,
        .button {
          .wide {
            width: var(--size-4);
            height: var(--size-4);
            margin-left: 0.05em;
          }
        }
      }

      &.centered {
        gap: var(--size-4);

        .icon,
        .vue-feather {
          width: var(--size-6);
          height: var(--size-6);
        }
      }

      button,
      .button {
        .icon,
        .vue-feather {
          color: var(--gray-z-7);
        }

        &:--highlight {
          .icon,
          .vue-feather {
            color: var(--gray-z-9);
          }
        }
      }
    }

    &:--highlight {
      &:after {
        opacity: 0.5;
      }
      &.semi:after {
        opacity: 0.1;
      }
      nav {
        opacity: 1;
        pointer-events: all;
      }
    }
  }

  img {
    transform: scale(1.2);
    width: 100%;
    opacity: 0;
    transition: all var(--speed);
  }

  &.loaded {
    img {
      transform: scale(1.025);
      opacity: 1;
    }
  }
}
</style>
