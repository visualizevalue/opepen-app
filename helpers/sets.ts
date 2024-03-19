import { DateTime } from 'luxon'

// TODO: Deprecate
export const SET_TIMESTAMPS = {
  '1': 1683046800,
  '2': 1683046800,
}

type OpepenSet = {
  id: number
  submission: {
    reveals_at: string
  }
}

type KeyedSets = {
  [key: string]: OpepenSet
}

export const TYPES = {
  PRINT: 'Print',
  NUMBERED_PRINT: 'Numbered Print',
  DYNAMIC: 'Dynamic'
}

const sets: Ref<OpepenSet[]> = ref([])
const loaded = ref(false)
const setsById: ComputedRef<KeyedSets> = computed(() => sets.value?.reduce((obj: KeyedSets, set) => {
  obj[set.id] = set
  return obj
}, {}))
const publishedSets: ComputedRef<OpepenSet[]> = computed(() => sets.value?.filter(set => !! set.submission.reveals_at))
const setsByPublishDate: ComputedRef<OpepenSet[]> = computed(() => publishedSets.value?.sort(
  (set1, set2) => set1.submission.reveals_at >= set2.submission.reveals_at ? 1 : -1)
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

export const RESERVED_UNTIL = 31

export function useSets() {
  const config = useRuntimeConfig()

  const fetchSets = async () => {
    sets.value = await $fetch(`${config.public.opepenApi}/opepen/sets`)
    loaded.value = true
  }

  return {
    sets,
    setsById,
    loaded,
    publishedSets,
    setsByPublishDate,
    completeSets,
    currentSet,
    prevSet,
    nextSet,
    fetchSets,
  }
}
