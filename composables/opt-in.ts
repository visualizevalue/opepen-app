export const useOptIn = async (submission: Ref<Object>) => {
  const now = useNow()
  const optInUntil = computed(() => DateTime
    .fromISO(submission.value?.starred_at)
    .plus({ hours: OPT_IN_HOURS })
  )
  const secondsUntilOptInClose = computed(() => optInUntil.value.toUnixInteger() - now.value)
  const optInCountDown = useCountDown(secondsUntilOptInClose)
  const optInAvailable = computed(() => {
    if (submission.value?.deleted_at) return false
    if (submission.value?.revealed_at) return false
    return true
  })

  return {
    optInAvailable,
    optInUntil,
    secondsUntilOptInClose,
    optInCountDown,
  }
}

export const useStagedOptIn = async () => {
  const { submission, reloadStagedSubmission } = await useStagedSet()

  const optIn = await useOptIn(submission)

  return {
    ...optIn,
    submission,
    reloadStagedSubmission,
  }
}

