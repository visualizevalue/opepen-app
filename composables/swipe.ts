import { useSwipe } from '@vueuse/core'

const isSwiping = ref(false)
const direction = ref()
const lengthX = ref(0)
const lengthY = ref(0)
const coordsStart = ref(0)
const coordsEnd = ref(0)

const isHorizontal = computed(() => ['left', 'right'].includes(direction.value))

export const useSetupGlobalSwipe = (el) => {
  const swipe = useSwipe(el, {
    threshold: 0,
  })

  watchEffect(() => {
    isSwiping.value = swipe.isSwiping.value
    direction.value = swipe.direction.value
    lengthX.value = swipe.lengthX.value
    lengthY.value = swipe.lengthY.value
    coordsStart.value = swipe.coordsStart
    coordsEnd.value = swipe.coordsEnd
  })
}

export const useGlobalSwipe = () => ({
  isSwiping,
  direction,
  lengthX,
  lengthY,
  coordsStart,
  coordsEnd,
  isHorizontal,
})
