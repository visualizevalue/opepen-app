import { DateTime } from 'luxon'

// TODO: Deprecate
export const SET_TIMESTAMPS = {
  '1': 1683046800,
  '2': 1683046800,
}

type OpepenSet = {
  reveals_at: string
}

export const TYPES = {
  PRINT: 'Print',
  NUMBERED_PRINT: 'Numbered Print',
  DYNAMIC: 'Dynamic'
}

const sets: Ref<OpepenSet[]> = ref([])
const loaded = ref(false)
const publishedSets: ComputedRef<OpepenSet[]> = computed(() => sets.value?.filter(set => !! set.reveals_at))
const setsByPublishDate: ComputedRef<OpepenSet[]> = computed(() => publishedSets.value?.sort(
  (set1, set2) => set1.reveals_at >= set2.reveals_at ? 1 : -1)
)
const activeSets: ComputedRef<OpepenSet[]> = computed(() => {
  const now = DateTime.now()

  return publishedSets.value?.filter(set => DateTime.fromISO(set.reveals_at) > now)
})
const completeSets: ComputedRef<OpepenSet[]> = computed(() => {
  const now = DateTime.now()

  return publishedSets.value?.filter(set => DateTime.fromISO(set.reveals_at) < now)
})
const currentSet: ComputedRef<OpepenSet> = computed(() => {
  const now = DateTime.now()

  const set = activeSets.value
    .find((s: OpepenSet) => DateTime.fromISO(s.reveals_at) > now)

  if (! set) return sets.value[sets.value.length - 1]

  return set
})
const prevSet = (id: number) => {
  if (id === 1) return null

  return sets.value[id - 2]
}
const nextSet = (id: number) => {
  if (id >= 200) return null

  return sets.value[id]
}

export function useSets() {
  const config = useRuntimeConfig()

  const fetchSets = async () => {
    sets.value = await $fetch(`${config.public.opepenApi}/opepen/sets`)
    loaded.value = true
  }

  return {
    sets,
    loaded,
    publishedSets,
    setsByPublishDate,
    activeSets,
    completeSets,
    currentSet,
    prevSet,
    nextSet,
    fetchSets,
  }
}
