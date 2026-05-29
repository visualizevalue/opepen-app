// Unified protocol activity feed for the timeline. Merges multiple real
// sources into one chronological stream instead of a manual tweet wall:
//   - set reveals      (a set enters the permanent collection)
//   - secondary sales  (from the sales feed; dormant until that API ships)
//   - notable tweets   (the existing admin-curated highlights)
// Each source degrades independently, so the feed always renders what it has.

export type ActivityType = 'reveal' | 'sale' | 'tweet'

export type ActivityEntry = {
  id: string
  type: ActivityType
  timestamp: string // ISO
  data: any
}

export type ActivityFilter = 'all' | 'reveals' | 'sales' | 'notable'

export const useActivity = async () => {
  const api = useApiBase()
  const { completeSets } = await useSets()
  const { sales } = useRecentSales(25)

  const tweets = ref<any[]>([])
  const loadTweets = async () => {
    try {
      const res: any = await $fetch(`${api}/curated-tweets?sort=-tweet_created_at`)
      tweets.value = Array.isArray(res) ? res : []
    } catch (e) {
      tweets.value = []
    }
  }
  onMounted(loadTweets)

  const filter = ref<ActivityFilter>('all')

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
      sales: 'sale',
      notable: 'tweet',
    }
    return entries.value.filter((e) => e.type === map[filter.value])
  })

  return { entries, filtered, filter, tweets, reloadTweets: loadTweets }
}
