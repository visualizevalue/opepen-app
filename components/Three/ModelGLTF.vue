<script setup lang="ts">
import { useGLTF } from '@tresjs/cientos'

const { path } = defineProps({
  path: {
    type: String,
    default: '/opepen.glb',
  },
})
const emit = defineEmits(['loaded'])

const { scene } = await useGLTF(path, { draco: true })

emit('loaded', scene)

defineExpose({
  scene,
})
</script>

<template>
  <primitive :object="scene" />
</template>
