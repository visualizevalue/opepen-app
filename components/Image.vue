<template>
  <article class="image" :class="{ loaded: loaded || isSVG || isVideo }" v-intersection-observer="loadImage">
    <div class="inner image">
      <iframe v-if="hasEmbed && !hasImageEmbed" :src="embedURI" frameborder="0" sandbox="allow-scripts"></iframe>
      <video v-else-if="isVideo" :src="uri" playsinline loop autoplay muted ref="video"></video>
      <img
        v-else-if="uri || hasImageEmbed"
        ref="imageEl"
        :src="hasImageEmbed ? embed : uri"
        @error="loadOriginal"
        @load="imageLoaded"
      >
      <OpepenSchematics v-else-if="! props.image" class="schematics" />
      <slot />
    </div>
  </article>
</template>

<script setup>
import { vIntersectionObserver } from '@vueuse/components'
import { imageURI } from '~/helpers/images'

const props = defineProps({
  image: Object,
  version: String,
  embed: String,
  autoEmbed: Boolean,
})

const uri = ref('')
const loaded = ref(false)
const isVideo = computed(() => ['mp4', 'webm'].includes(props.image?.type))
const isSVG = computed(() => props.image?.type === 'svg')
const hasEmbed = computed(() => props.embed || (uri.value && isSVG.value && props.autoEmbed))
// FIXME: Refactor this...
const hasImageEmbed = computed(() => hasEmbed.value && props.embed?.endsWith('.gif'))
const embedURI = computed(() => props.embed || uri.value)

const loadImage = ([{ isIntersecting }]) => {
  if (! isIntersecting) return

  if (! props.image) return

  const version = props.image.versions[props.version] ? props.version : ''

  uri.value = imageURI(props.image, version)
}
const loadOriginal = () => {
  uri.value = imageURI(props.image)
}
watch(() => props.image?.uuid, () => loadImage([{ isIntersecting: true }]))

// Image loaded event
const imageLoaded = () => loaded.value = true
</script>

<style lang="postcss">
article.image {
  overflow: hidden;
  background-color: var(--gray-z-3);
  border: 1px solid var(--gray-z-4);

  position: relative;
  height: 0;
  padding-bottom: 100%;
  padding-bottom: calc(100% - 2px);

  &:not(.square) {
    border-radius: var(--size-5);
    border-top-left-radius: var(--size-1);
  }

  &.square {
    border-radius: var(--size-1);
  }

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

    img {
      opacity: 0.001;
    }

    &.up {
      transform: translateY(var(--size-6));
    }

    &.loaded {
      opacity: 1;
      transform: translateY(0);

      img {
        opacity: 1;
      }
    }
  }
}
</style>
