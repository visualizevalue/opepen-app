export const useEditionGroups = (tokens: Ref<{ data: { edition: number } }[]>) => {
  const grouped = computed(() =>
    tokens.value.reduce(
      (groups, o) => {
        groups[o.data.edition].push(o)

        return groups
      },
      { 1: [], 4: [], 5: [], 10: [], 20: [], 40: [] },
    ),
  )

  return grouped
}

export const useOpepen = async (addresses: string[]) => {
  const config = useRuntimeConfig()
  const opepen = ref([])
  const opepenLoading = ref(false)

  const fetchOpepen = async (addrs = addresses) => {
    if (!addrs.filter((a) => !!a).length) return

    opepenLoading.value = true
    const responses = await Promise.all(
      addrs.map(async (a) => {
        try {
          return await $fetch(`${config.public.opepenApi}/accounts/${a}/opepen?limit=16000`)
        } catch (e) {
          return null
        }
      }),
    )
    opepen.value = responses
      .filter((r) => !!r?.data)
      .reduce((opepen, response) => {
        return opepen.concat(response.data)
      }, [])

    opepenLoading.value = false
  }
  onMounted(() => fetchOpepen(addresses))

  const unrevealedOpepen = computed(() => (opepen.value || []).filter((o) => !o.revealed_at))
  const opepenByEdition = useEditionGroups(unrevealedOpepen)

  // v5: revealed Opepen that may migrate forward into a new set. Empty unless
  // the migration flag is on, so current behaviour is untouched when off.
  const v5 = useV5Migration()
  const migratableOpepen = computed(() =>
    v5 ? (opepen.value || []).filter((o) => !!o.revealed_at) : [],
  )

  // The full pool eligible to opt into a new set: blank Opepen always, plus
  // revealed Opepen under v5. Grouped by edition for the opt-in UI.
  const optInableOpepen = computed(() => [
    ...unrevealedOpepen.value,
    ...migratableOpepen.value,
  ])
  const optInableByEdition = useEditionGroups(optInableOpepen)

  return {
    opepenLoading,
    opepen,
    unrevealedOpepen,
    opepenByEdition,
    migratableOpepen,
    optInableOpepen,
    optInableByEdition,
    fetchOpepen,
  }
}
