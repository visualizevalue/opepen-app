import { useWindowSize } from '@vueuse/core'

export const useWindow = () => {
  const { width } = useWindowSize()

  const isDesktop = computed(() => width.value >= BREAKPOINTS.LG)

  return {
    isDesktop,
    width,
  }
}
