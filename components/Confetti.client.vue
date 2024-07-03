<template>
  <div>
    <canvas ref="canvas"></canvas>
  </div>
</template>

<script setup>
import Confetti from 'canvas-confetti'

const canvas = ref(null)

const _confetti = Confetti.create(canvas.value, { resize: true })

const opepen = Confetti.shapeFromPath({ path: `M0 0H1C1.55228 0 2 0.447715 2 1C2 1.55228 1.55228 2 1 2C0.447715 2 0 1.55228 0 1V0Z M0 2H4V3C4 3.55228 3.55228 4 3 4H1C0.447715 4 0 3.55228 0 3V2Z M2 1C2 0.447715 2.44772 0 3 0C3.55228 0 4 0.447715 4 1C4 1.55228 3.55228 2 3 2C2.44772 2 2 1.55228 2 1Z` })
const leftEye = Confetti.shapeFromPath({ path: `M0 0H10C15.5228 0 20 4.47715 20 10V10C20 15.5228 15.5228 20 10 20V20C4.47715 20 0 15.5228 0 10V0Z` })
const mouth = Confetti.shapeFromPath({ path: `M0 0H40V10C40 15.5228 35.5228 20 30 20H10C4.47715 20 0 15.5228 0 10V0Z` })
const quarter = Confetti.shapeFromPath({ path: `M0 20C0 8.95431 8.95431 0 20 0V0V20H0V20Z` })

const confetti = (config = {}) => {
  _confetti({
    particleCount: 150,
    spread: 69,
    shapes: [leftEye, mouth, `circle`, `square`, opepen, quarter],
    scalar: 1.4,
    ...config,
  })
}

defineExpose({
  confetti,
})
</script>

<style lang="postcss" scoped>
canvas {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  pointer-events: none;
  z-index: 2000;
}
</style>
