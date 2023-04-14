<template>
  <slot name="before" :download="download" :downloadHD="downloadHD" />
  <article class="ai-image" :class="{ loaded }">
    <div class="inner image">
      <!-- TODO: Add preview image (SVG outline) -->
      <!-- <div v-if="!loaded && previewTokenUrl" class="preview">
        <img :src="previewTokenUrl" crossorigin="anonymous" loading="eager" >
      </div> -->
      <img
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
          <!-- <button><Icon type="arrow-up-left" :stroke-width="2.5" /></button>
          <button><Icon type="x" :stroke-width="2.5" /></button> -->
          <NuxtLink :to="`/opepens/${image.uuid}`" class="button"><Icon type="maximize" :stroke-width="3" class="wide" /></NuxtLink>
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

const config = useRuntimeConfig()

const props = defineProps({
  step: Object,
  image: Object,
  version: String,
})

const image = ref(props.image)
const imageEl = ref(null)
const loaded = ref(false)
const uri = ref('')
const versionedUri = computed(() => props.version
  ? image.value.uri.replace(`.png`, `@${props.version}.png`)
  : image.value.uri
)

// Load image
onMounted(() => {
  uri.value = image.value.uri
})

// Image loaded
const imageLoaded = () => loaded.value = true

onMounted(async () => {
  if (! image.value.uuid) {
    image.value = await post(`${config.public.opepenApi}/steps/${props.step.uuid}/dream`)
    uri.value = image.value.uri
  }
})

// Actions
const reseed = async () => {
  loaded.value = false
  image.value = await post(`${config.public.opepenApi}/ai-images/${image.value.uuid}/reseed`)
  image.value.uri += `?v=${Date.now()}`
  uri.value = image.value.uri
  // Image will reload and call loaded event
}
const download = async () => await downloadImage(versionedUri.value, { name: props.version ? `${image.value.uuid}@${props.version}` : image.value.uuid })
const downloadHD = async () => await downloadImage(image.value.uri.replace(`.png`, `@2048.png`), { name: `${image.value.uuid}@2048` })
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

    &.active,
    &:hover {
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
