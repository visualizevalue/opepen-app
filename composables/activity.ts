// Unified protocol activity feed for the timeline. Merges multiple real
// sources into one chronological stream instead of a manual tweet wall:
//   - set reveals      (a set enters the permanent collection)
//   - secondary sales  (from the sales feed; dormant until that API ships)
//   - notable tweets   (the existing admin-curated highlights)
// Each source degrades independently, so the feed always renders what it has.

export type ActivityType = 'reveal' | 'sale' | 'optin' | 'submission' | 'tweet'

export type ActivityEntry = {
  id: string
  type: ActivityType
  timestamp: string // ISO
  data: any
}

export type ActivityFilter =
  | 'all'
  | 'reveals'
  | 'submissions'
  | 'optins'
  | 'sales'
  | 'notable'

export const useActivity = async () => {
  const api = useApiBase()
  const { completeSets } = await useSets()
  const { sales } = useRecentSales(25)

  const tweets = ref<any[]>([])
  const loadTweets = async () => {
    try {
      const res: any = await $fetch(`${api}/curated-tweets?sort=-tweet_created_at`)
      tweets.value = Array.isArray(res) ? res : (res?.data ?? [])
    } catch (e) {
      tweets.value = []
    }
  }

  // Macro opt-in feed — protocol-wide opt-in / opt-out activity across all sets.
  const optIns = ref<any[]>([])
  const loadOptIns = async () => {
    try {
      const res: any = await $fetch(`${api}/set-submissions/history?limit=40`)
      optIns.value = (res?.data ?? res ?? []).filter((h: any) => h?.submission?.name)
    } catch (e) {
      optIns.value = []
    }
  }

  // Newly submitted sets (the submission pipeline, before consensus).
  const submissions = ref<any[]>([])
  const loadSubmissions = async () => {
    try {
      const res: any = await $fetch(`${api}/set-submissions?sort=-created_at&limit=30`)
      submissions.value = (res?.data ?? res ?? []).filter(
        (s: any) => s?.name && s?.created_at && !s?.deleted_at,
      )
    } catch (e) {
      submissions.value = []
    }
  }

  // Loaded during setup (not onMounted — lifecycle hooks don't register after an
  // await, which is why these were empty). Runs on server and client.
  await Promise.all([loadTweets(), loadOptIns(), loadSubmissions()])

  const filter = ref<ActivityFilter>('all')

  // The opt-in history endpoint returns a light submission (no images). Resolve
  // the full submission by uuid from the submissions + revealed sets we already
  // have loaded, so opt-in entries can show the artwork being opted into.
  const submissionByUuid = computed<Record<string, any>>(() => {
    const m: Record<string, any> = {}
    for (const s of submissions.value) {
      if (s?.uuid) m[s.uuid] = s
    }
    for (const c of completeSets.value) {
      const s = c?.submission
      if (s?.uuid && !m[s.uuid]) m[s.uuid] = s
    }
    return m
  })

  const EDITIONS = ['1', '4', '5', '10', '20', '40']

  // The artwork for an opt-in: pick one of the editions the holder actually
  // opted into (per max_reveals), chosen deterministically from the row id so
  // server and client agree.
  const optInImage = (h: any) => {
    const sub = submissionByUuid.value[h?.submission?.uuid]
    if (!sub) return h?.submission?.edition1Image || null

    const opted = EDITIONS.filter((e) => h?.max_reveals?.[e])
    const pool = opted.length ? opted : EDITIONS
    const edition = pool[Number(h?.id || 0) % pool.length]

    return sub[`edition${edition}Image`] || sub.edition1Image || null
  }

  const entries = computed<ActivityEntry[]>(() => {
    const list: ActivityEntry[] = []

    for (const s of completeSets.value) {
      if (!s?.submission?.reveals_at) continue
      list.push({
        id: `reveal-${s.id}`,
        type: 'reveal',
        timestamp: s.submission.reveals_at,
        data: s,
      })
    }
    for (const sale of sales.value) {
      if (!sale?.timestamp) continue
      list.push({ id: `sale-${sale.id}`, type: 'sale', timestamp: sale.timestamp, data: sale })
    }
    for (const h of optIns.value) {
      if (!h?.created_at) continue
      const edition1Image = optInImage(h)
      list.push({
        id: `optin-${h.id}`,
        type: 'optin',
        timestamp: h.created_at,
        data: { ...h, submission: { ...h.submission, edition1Image } },
      })
    }
    for (const s of submissions.value) {
      list.push({ id: `submission-${s.uuid}`, type: 'submission', timestamp: s.created_at, data: s })
    }
    for (const t of tweets.value) {
      if (!t?.tweet_created_at) continue
      list.push({ id: `tweet-${t.id}`, type: 'tweet', timestamp: t.tweet_created_at, data: t })
    }

    return list.sort((a, b) => (a.timestamp < b.timestamp ? 1 : -1))
  })

  const filtered = computed(() => {
    if (filter.value === 'all') return entries.value
    const map: Record<Exclude<ActivityFilter, 'all'>, ActivityType> = {
      reveals: 'reveal',
      submissions: 'submission',
      optins: 'optin',
      sales: 'sale',
      notable: 'tweet',
    }
    return entries.value.filter((e) => e.type === map[filter.value])
  })

  return { entries, filtered, filter, tweets, reloadTweets: loadTweets }
}
