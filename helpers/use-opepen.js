export const useOpepen = async addresses => {
  const config = useRuntimeConfig()
  const opepen = ref([])
  const opepenLoading = ref(false)

  const fetchOpepen = async (addrs = addresses) => {
    if (! addrs.filter(a => !!a).length) return

    opepenLoading.value = true
    const responses = await Promise.all(addrs.map(async a => {
      try {
        return await $fetch(`${config.public.opepenApi}/accounts/${a}/opepen?limit=16000&includes[]=submission`)
      } catch(e) {
        return null
      }
    }))
    opepen.value = responses
      .filter(r => !! r?.data)
      .reduce((opepen, response) => {
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
