<template>
  <article :class="{ loaded }">
    <div class="inner">
      <Loading v-if="! loaded" txt="" />
      <!-- TODO: Add preview image (SVG outline) -->
      <!-- <div v-if="!loaded && previewTokenUrl" class="preview">
        <img :src="previewTokenUrl" crossorigin="anonymous" loading="eager" >
      </div> -->
      <img
        ref="imageEl"
        :src="image.uri"
        loading="lazy"
        @load="imageLoaded"
      >
    </div>
    <div v-if="loaded" class="inner overlay">
      <nav class="top">
        <button><Icon type="arrow-up-left" /></button>
        <button><Icon type="x" /></button>
      </nav>
    </div>
  </article>
</template>

<script setup>
import { post } from '~/api'
const config = useRuntimeConfig()

const props = defineProps({
  step: Object,
  image: Object,
})

const image = ref(props.image)
const imageEl = ref(null)
const loaded = ref(false)

// Image loaded
const imageLoaded = () => loaded.value = true

onMounted(async () => {
  if (! image.value.uuid) {
    image.value = await post(`${config.public.opepenApi}/steps/${props.step.uuid}/dream`)
  }
})
</script>

<style lang="postcss" scoped>
article {
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
      opacity: 0;
      transition: all var(--speed);
      z-index: 1;
    }

    &:hover {
      &:after {
        opacity: 0.5;
      }
    }

    nav {
      position: absolute;
      z-index: 2;
      top: var(--size-3);
      right: var(--size-3);
      display: flex;
      gap: var(--size-2);

      .icon,
      .vue-feather {
        color: var(--gray-z-9);
        width: var(--size-5);
        height: var(--size-5);
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
