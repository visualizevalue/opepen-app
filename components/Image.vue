<template>
  <article
    class="image"
    :class="{
      loaded,
      'custom-loading': isSVG || isVideo || is3d,
    }"
    @click="$emit('click')"
    :style="{ padding: `0 0 ${height}` }"
    v-intersection-observer="loadImage"
  >
    <div class="inner image">
      <Suspense>
        <ThreeModelViewer v-if="is3d && autoEmbed" :path="imageURI(image)" @loaded="() => loaded = true" />
        <iframe v-else-if="displayIframe" :src="embedURI" frameborder="0" sandbox="allow-scripts"></iframe>
        <video v-else-if="displayVideo" :src="uri" playsinline loop autoplay muted ref="video"></video>
        <img
          v-else
          ref="imageEl"
          alt="Opepen image"
          :src="props.image ? hasImageEmbed ? embed : uri : '/schematics.svg'"
          @error="loadOriginal"
          @load="imageLoaded"
        >
      </Suspense>
      <slot />
    </div>
  </article>
</template>

<script setup>
import { vIntersectionObserver } from '@vueuse/components'

const props = defineProps({
  image: [String, Object],
  aspectRatio: Number,
  version: String,
  embed: String,
  autoEmbed: {
    type: Boolean,
    default: true,
  },
})
const emit = defineEmits(['click','loaded'])

const uri = ref('')
const loaded = ref(false)
const is3d = computed(() => ['gbl', 'gltf', 'glb-json', 'glb-binary', 'gltf-json', 'gltf-binary'].includes(props.image?.type))
const isVideo = computed(() => ['mp4', 'webm'].includes(props.image?.type))
const isSVG = computed(() => props.image?.type === 'svg')
const hasEmbed = computed(() => props.embed || (uri.value && (isSVG.value && !props.version) && props.autoEmbed))
// FIXME: Refactor this...
const hasImageEmbed = computed(() => hasEmbed.value && props.embed?.endsWith('.gif'))
const embedURI = computed(() => props.embed || uri.value)
const imageEl = ref(null)
const aspectRatio = ref(1)
const computeAspectRatio = () => {
  aspectRatio.value = (
    props.aspectRatio || // The passed aspect ratio
    props.image?.aspect_ratio || // The image object aspect ratio
    (imageEl.value?.naturalWidth / (imageEl.value?.naturalHeight || 1)) || // The natural image element ratio
    1 // The default square ratio
  )
}
computeAspectRatio()
const height = computed(() => (1 / aspectRatio.value) * 100 + '%')
const displayIframe = computed(() => hasEmbed.value && !hasImageEmbed.value)
const displayVideo = computed(() => isVideo.value && !props.version)
watch([is3d, displayIframe, displayVideo], () => {
  if (displayIframe.value || displayVideo.value || is3d.value) emit('loaded')
})

const loadImage = ([{ isIntersecting }]) => {
  if (! isIntersecting) return

  if (! props.image) return

  if (typeof props.image === 'string') {
    uri.value = normalizeURI(props.image)
    return
  }

  uri.value = imageURI(props.image, props.version)
}
const loadOriginal = () => {
  uri.value = imageURI(props.image)
  emit('loaded')
}
watch(() => props.image?.uuid, () => loadImage([{ isIntersecting: true }]))

// Image loaded event
const imageLoaded = () => {
  loaded.value = true
  emit('loaded')
  computeAspectRatio()
}
</script>

<style>
article.image {
  overflow: hidden;

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
    border: 1px solid var(--gray-z-4);
    background-color: var(--gray-z-2);
    overflow: hidden;
    border-radius: var(--size-1);
  }

  .image {
    video,
    img,
    iframe {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-fit: contain;
    }
  }

  img {
    transform: scale(1.2);
    width: 100%;
    opacity: 0;
    transition: all var(--speed);
  }

  .schematics {
    opacity: 0.15;
  }

  &.loaded {
    img {
      transform: scale(1);
      opacity: 1;
    }
  }

  &.appear {
    opacity: 0.5;
    transition: all var(--speed-slow);
    animation: wrapper-appear var(--speed) forwards;

    iframe,
    svg,
    video,
    img {
      opacity: 0.001;
    }

    &.up {
      transform: translateY(var(--size-6));

      &.loaded,
      &.custom-loading {
        transform: translateY(0);
      }
    }

    &.loaded,
    &.custom-loading {
      opacity: 1;
      transform: translateY(0);

      iframe,
      svg,
      video,
      img {
        animation: img-appear var(--speed-slow) forwards;
      }
    }
  }
}

@keyframes wrapper-appear {
  from {
    opacity: 0.7;
  }
  to {
    opacity: 1;
  }
}

@keyframes img-appear {
  from {
    opacity: 0.1;
    transform: scale(1.2);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.image {
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

    h1 {
      margin-bottom: var(--size-1);
      text-transform: none;
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
      bottom: 0;
      background-color: var(--semi);
    }
  }
}
</style>
