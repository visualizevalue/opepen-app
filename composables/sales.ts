// Recent secondary sales. Reads the global sales feed; degrades to an empty
// list if the endpoint isn't available yet (so the homepage section just hides).
export const useRecentSales = (limit = 8) => {
  const api = useApiBase()
  const sales = ref<any[]>([])
  const loading = ref(false)

  const load = async () => {
    loading.value = true
    try {
      const res: any = await $fetch(`${api}/opepen/sales?limit=${limit}`)
      sales.value = res?.data ?? res ?? []
    } catch (e) {
      sales.value = []
    }
    loading.value = false
  }

  onMounted(load)

  return { sales, loading, reload: load }
}

// Most popular sets by sale volume. Returns the raw [{ set_id, volume, sales }]
// rows; the caller maps set_id → set via useSets.
export const usePopularSets = (limit = 8) => {
  const api = useApiBase()
  const popular = ref<{ set_id: number; volume: string; sales: number }[]>([])

  const load = async () => {
    try {
      const res: any = await $fetch(`${api}/opepen/sets/popular?limit=${limit}`)
      popular.value = Array.isArray(res) ? res : []
    } catch (e) {
      popular.value = []
    }
  }

  onMounted(load)

  return { popular, reload: load }
}
