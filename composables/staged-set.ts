const INTERVAL = 2 * 60 * 1000 // 2 minutes
let intervalInitialized: boolean = false

export const useStagedSet = async () => {
  const submission = useState<SetSubmission | undefined>('staged-set:submission')
  const lastUpdated = useState<number | undefined>('staged-set:last-updated')
  const { data, refresh: reloadStagedSubmission } = await useApi('/set-submissions/curated', {
    key: 'curated-submission',
    dedupe: 'defer',
    immediate: false,
    onResponse: () => {
      lastUpdated.value = nowInSeconds()
    },
  })

  const syncSubmission = () => {
    if (!data.value?.submission) return

    submission.value = data.value.submission
  }

  // Load initially
  if (!submission.value) {
    await reloadStagedSubmission()
    syncSubmission()
  }

  // Update every 2 minuts
  if (import.meta.client && !intervalInitialized) {
    setInterval(() => {
      if (!submission.value) return

      reloadStagedSubmission()

      console.info(`Pinged staged set update: ${submission.value.name}`)
    }, INTERVAL)

    console.info(`Set up staged set watcher`)
    intervalInitialized = true
  }

  // Keep the shared state aligned with manual and interval refreshes.
  watch(data, syncSubmission, { immediate: true })

  return {
    submission,
    reloadStagedSubmission,
    lastUpdated,
  }
}
