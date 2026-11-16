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
  DYNAMIC: 'Dynamic',
}

const sets: Ref<OpepenSet[]> = ref([])
const loaded = ref(false)
const allSetIds = [...Array(200)].map((_, i) => i + 1)
const setsById: ComputedRef<KeyedSets> = computed(() =>
  sets.value?.reduce((obj: KeyedSets, set) => {
    obj[set.id] = set
    return obj
  }, {}),
)
const submissions = computed(() => allSetIds.map((i) => setsById.value[i]?.submission || {}))
const publishedSets: ComputedRef<OpepenSet[]> = computed(
  () => sets.value?.filter((set) => !!set.submission.reveals_at) || [],
)
const featuredSets: ComputedRef<OpepenSet[]> = computed(() =>
  publishedSets.value
    .filter((set) => !!set.submission.featured)
    .sort((a, b) => (a.submission.featured > b.submission.featured ? -1 : 1)),
)
const setsByPublishDate: ComputedRef<OpepenSet[]> = computed(() =>
  publishedSets.value?.sort((set1, set2) =>
    (set1.submission.reveals_at || '') >= (set2.submission.reveals_at || '') ? 1 : -1,
  ),
)
const completeSets: ComputedRef<OpepenSet[]> = computed(() => {
  const now = DateTime.now()

  return publishedSets.value?.filter(
    (set) => DateTime.fromISO(set.submission.reveals_at) < now,
  )
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

/*
 * The sets list is embedded in the HTML of every page that reads it, so keep
 * only what those pages draw: names, dates, flags and the six preview images.
 * The full record (creator, co-creators, links, signatures) is ~7x larger and
 * is loaded by the set page itself.
 */
const SUBMISSION_FIELDS = [
  'uuid',
  'set_id',
  'name',
  'artist',
  'edition_type',
  'featured',
  'published_at',
  'starred_at',
  'reveals_at',
  'aspect_ratio',
  'submission_stats',
] as const
const IMAGE_FIELDS = ['uuid', 'type', 'cdn', 'path', 'aspect_ratio', 'versions'] as const
const EDITION_IMAGES = [1, 4, 5, 10, 20, 40].map((edition) => `edition${edition}Image`)

const pick = (source: Record<string, any> | null | undefined, fields: readonly string[]) =>
  source
    ? Object.fromEntries(fields.filter((f) => f in source).map((f) => [f, source[f]]))
    : source

const slimSets = (response: any): OpepenSet[] =>
  Array.isArray(response)
    ? response.map((set) => ({
        id: set.id,
        submission: {
          ...pick(set.submission, SUBMISSION_FIELDS),
          ...Object.fromEntries(
            EDITION_IMAGES.map((key) => [key, pick(set.submission?.[key], IMAGE_FIELDS)]),
          ),
        } as SetSubmission,
      }))
    : response

export async function useSets() {
  const { data, execute: fetchSets } = await useApi(`/opepen/sets`, {
    immediate: false,
    transform: slimSets,
    onResponse: () => (loaded.value = true),
  })

  if (!sets.value?.length && !loaded.value) {
    await fetchSets()
  }

  watchEffect(() => {
    // @ts-ignore
    if (!data.value?.length) return
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
