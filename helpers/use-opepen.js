export const useOpepen = async addresses => {
  const config = useRuntimeConfig()
  const opepen = ref([])
  const opepenLoading = ref(false)

  const fetchOpepen = async (addresses) => {
    if (! addresses.filter(a => !!a).length) return

    opepenLoading.value = true
    const responses = await Promise.all(addresses.map(a =>
      $fetch(`${config.public.opepenApi}/accounts/${a}/opepen?limit=16000`)
    ))
    opepen.value = responses.reduce((opepen, response) => {
      return opepen.concat(response.data)
    }, [])
    opepenLoading.value = false
  }
  onMounted(() => fetchOpepen(addresses))

  const opepenByEdition = computed(() => {
    const items = opepen.value || []

    return items
      .filter(o => ! o.revealed_at)
      .reduce((groups, o) => {
        groups[o.data.edition].push(o)

        return groups
      }, { 1: [], 4: [], 5: [], 10: [], 20: [], 40: [] })
  })

  return {
    opepenLoading,
    opepen,
    opepenByEdition,
    fetchOpepen,
  }
}
