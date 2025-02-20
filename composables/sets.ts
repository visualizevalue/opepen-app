type OpepenSet = {
  id: number
  submission: SetSubmission
}

type KeyedSets = {
  [key: string]: OpepenSet
}

export const SET_TYPES = {
  PRINT: 'Print',
  NUMBERED_PRINT: 'Numbered Print',
  DYNAMIC: 'Dynamic'
}

const sets: Ref<OpepenSet[]> = ref([])
const loaded = ref(false)
const allSetIds = [...Array(200)].map((_ , i) => i + 1)
const setsById: ComputedRef<KeyedSets> = computed(() => sets.value?.reduce((obj: KeyedSets, set) => {
  obj[set.id] = set
  return obj
}, {}))
const submissions = computed(() => allSetIds.map(i => setsById.value[i]?.submission || {}))
const publishedSets: ComputedRef<OpepenSet[]> = computed(
  () => sets.value?.filter(set => !! set.submission.reveals_at) || []
)
const featuredSets: ComputedRef<OpepenSet[]> = computed(
  () => publishedSets.value
      .filter(set => !! set.submission.featured)
      .sort((a, b) => a.submission.featured > b.submission.featured ? -1 : 1)
)
const setsByPublishDate: ComputedRef<OpepenSet[]> = computed(() => publishedSets.value?.sort(
  (set1, set2) => (set1.submission.reveals_at || '') >= (set2.submission.reveals_at || '') ? 1 : -1)
)
const completeSets: ComputedRef<OpepenSet[]> = computed(() => {
  const now = DateTime.now()

  return publishedSets.value?.filter(set => DateTime.fromISO(set.submission.reveals_at) < now)
})
const currentSet: ComputedRef<OpepenSet> = computed(() => {
  return sets.value[sets.value.length - 1]
})
const prevSet = (id: number) => {
  if (id === 1) return null

  return setsById.value[id - 1]
}
const nextSet = (id: number) => {
  if (id >= 200) return null

  return setsById.value[id + 1]
}

export async function useSets () {
  const { data, execute: fetchSets } = await useApi(`/opepen/sets`, {
    immediate: false,
    onResponse: () => loaded.value = true,
  })

  if (! sets.value?.length && ! loaded.value) {
    await fetchSets()
  }

  watchEffect(() => {
    // @ts-ignore
    if (! data.value?.length) return
    sets.value = data.value as OpepenSet[]
  })

  return {
    sets,
    setsById,
    loaded,
    publishedSets,
    setsByPublishDate,
    completeSets,
    featuredSets,
    currentSet,
    submissions,
    prevSet,
    nextSet,
    fetchSets,
  }
}
