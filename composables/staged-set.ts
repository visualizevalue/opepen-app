const INTERVAL = 2 * 60 * 1000 // 2 minutes
let intervalInitialized: boolean = false
let watcherInitialized: boolean = false
const submission = ref()
const lastUpdated = ref()

export const useStagedSet = async () => {
  const { data, refresh: reloadStagedSubmission } = await useApi('/set-submissions/curated', {
    key: 'curated-submission',
    dedupe: 'defer',
    immediate: false,
    onResponse: () => {
      lastUpdated.value = nowInSeconds()
    }
  })

  // Load initially
  if (! submission.value) await reloadStagedSubmission()

  // Update every 2 minuts
  if (import.meta.client && !intervalInitialized) {
    setInterval(() => {
      if (! submission.value) return

      reloadStagedSubmission()

      console.info(`Pinged staged set update: ${submission.value.name}`)
    }, INTERVAL)

    console.info(`Set up staged set watcher`)
    intervalInitialized = true
  }

  // Update our cache
  if (import.meta.client && !watcherInitialized) {
    watchEffect(() => {
      // @ts-ignore
      if (! data.value?.submission) return

      // @ts-ignore
      submission.value = data.value?.submission

      console.info(`Updated staged set cache: ${submission.value.name}`)
    })
    watcherInitialized = true
  }

  return {
    submission,
    reloadStagedSubmission,
    lastUpdated,
  }
}

