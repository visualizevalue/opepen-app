export const useStagedSet = async () => {
  const { data, refresh: reloadStagedSubmission } = await useApi('/set-submissions/curated')

  const submission = computed(() => data.value?.submission)

  const now = useNow()
  const optInUntil = computed(() => DateTime
    .fromISO(submission.value?.starred_at)
    .plus({ hours: OPT_IN_HOURS })
  )
  const secondsUntilOptInClose = computed(() => optInUntil.value.toUnixInteger() - now.value)
  const optInCountDown = useCountDown(secondsUntilOptInClose)
  const optInAvailable = computed(() => {
    if (! submission.value?.starred_at) return false

    const starred = DateTime.fromISO(submission.value.starred_at)
    const currentTime = DateTime.fromSeconds(now.value)

    return starred < currentTime && optInUntil.value > currentTime
  })

  return {
    submission,
    reloadStagedSubmission,

    optInAvailable,
    optInUntil,
    secondsUntilOptInClose,
    optInCountDown,
  }
}

