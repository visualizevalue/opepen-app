<script setup>
import { Box3, Vector3 } from 'three'

const { path } = defineProps({
  path: {
    type: String,
    default: '/opepen.glb',
  },
})

const emit = defineEmits(['loaded'])

const cameraPosition = ref([0, 0, 5])
const cameraLook = ref([0, 0, 0])
const fov = ref(50)

const onModelLoad = (model) => {
  // Center the model
  const box = new Box3().setFromObject(model)
  const center = box.getCenter(new Vector3())
  const size = box.getSize(new Vector3())

  // Reset model position to center
  model.position.sub(center)

  // Adjust camera distance based on model size
  const maxDim = Math.max(size.x, size.y, size.z)
  const fovq = fov.value * (Math.PI / 180)
  const cameraDistance = maxDim / (2 * Math.tan(fovq / 2))

  cameraPosition.value = [0, 0, cameraDistance * 1.618]

  emit('loaded')
}
</script>

<template>
  <TresCanvas clear-color="#000000" height="100%" width="100%">
    <TresPerspectiveCamera :position="cameraPosition" :look-at="cameraLook" />
    <OrbitControls enable-damping auto-rotate />
    <Suspense>
      <ThreeModelGLTF :path="path" @loaded="onModelLoad" />
    </Suspense>

    <!-- Key light -->
    <TresDirectionalLight :intensity="1.5" :position="[10, 0, 5]" />

    <!-- Fill light -->
    <TresDirectionalLight :intensity="1" :position="[-10, 5, 10]" />

    <!-- Back light -->
    <TresDirectionalLight :intensity="0.5" :position="[0, 5, -10]" />
    <TresAmbientLight :intensity="1" />
  </TresCanvas>
</template>

<style></style>
