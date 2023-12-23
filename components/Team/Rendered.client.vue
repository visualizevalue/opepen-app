<template>
  <canvas ref="canvas" />
</template>

<script setup>
import downloadImage, { canvas2URI } from '~/helpers/download-image'
import { imageURI } from '~/helpers/images'

const props = defineProps({
  items: Array,
  drawKey: Number,
})

const canvas = ref(null)
const context = computed(() => canvas.value?.getContext('2d'))
const download = async () => {
  const url = await canvas2URI(canvas.value)
  await downloadImage(url, { name: 'team'})
}
defineExpose({ download })

const bg = ref('#DBDBDB')
const stroke = ref('#fff')

const draw = (
  ctx = context.value,
  width = canvas.value?.offsetWidth,
  height = canvas.value?.offsetHeight
) => {
  if (! ctx?.canvas) return
  ctx.canvas.width  = width
  ctx.canvas.height = height

  ctx.fillStyle = bg.value
  ctx.rect(0, 0, width, height)
  ctx.fill()

  ctx.fillStyle = null
  ctx.strokeStyle = stroke.value

  const gridSize = width / 8

  ctx.drawImage(opepenIcon.value, 6 * gridSize + gridSize/3, 2 * gridSize - gridSize/3*2, gridSize/3, gridSize/3)

  props.items.forEach((item, index) => {
    const row = parseInt(index / 8)
    const column = index % 8

    if (item.disabled) return

    const x = column * gridSize
    const y = row * gridSize

    if (item.opepen?.image) {
      const img = new Image()
      img.crossOrigin = 'anonymous'
      img.onload = () => {
        ctx.drawImage(img, x, y, gridSize, gridSize)
      }
      img.src = imageURI(item.opepen.image, 'sm')
    } else {
      ctx.drawImage(xIcon.value, x + gridSize/2 - gridSize/8, y + gridSize/2 - gridSize/8, gridSize/4, gridSize/4)
    }

    ctx.rect(x, y, gridSize, gridSize)
    ctx.stroke()
  })
}

const xIcon = ref(new Image)
const opepenIcon = ref(new Image)
onMounted(() => {
  const svgStart = 'data:image/svg+xml;utf8,'

  const xPath = document.querySelector('.vue-feather--x svg').outerHTML
  xIcon.crossOrigin = 'anonymous'
  xIcon.value.src = svgStart + encodeURIComponent(xPath.replaceAll('currentColor', stroke.value))
  xIcon.onload = () => draw()

  const opepenPath = document.querySelector('.opepen-check svg').outerHTML
  opepenIcon.crossOrigin = 'anonymous'
  opepenIcon.value.src = svgStart + encodeURIComponent(opepenPath.replaceAll('currentColor', stroke.value))
  opepenIcon.onload = () => draw()
})

onMounted(() => draw())
watch(() => props.drawKey, () => draw())
</script>

<style lang="postcss" scoped>
  canvas {
    position: fixed;
    width: 1400px;
    height: 1400px;
    left: -200vw;
    left: calc(-200vw - 1400px);
  }
</style>
