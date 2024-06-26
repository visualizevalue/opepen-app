<template>
  <div class="preview">
    <div class="inner">
      <iframe
        ref="frame"
        frameborder="0"
      ></iframe>
        <!-- allow="accelerometer" -->
      <!-- sandbox="allow-scripts" -->
    </div>
  </div>
</template>

<script setup>
import { useWindowSize } from '@vueuse/core'

const { width, height } = useWindowSize()

const props = defineProps({
  id: String,
})

const config = useRuntimeConfig()
const src = computed(() => `${config.public.opepenApi}/generative/preview/${props.id}`)

const frame = ref(null)
const reload = () => {
  if (frame.value) {
    frame.value.src = src.value
  }
}

watch([width, height], () => reload())
onMounted(() => reload())

defineExpose({
  reload,
})
</script>

<style lang="postcss" scoped>
.preview {
  width: 100%;
  height: 100%;
}

.inner {
  width: 100%;
  height: 0;
  padding-bottom: 100%;
  position: relative;
  border: var(--border-dark);
  border-radius: var(--size-1);
  overflow: hidden;
  box-shadow: var(--shadow-lg);
}

iframe {
  position: absolute;
  width: 100%;
  height: 100%;
}
</style>
