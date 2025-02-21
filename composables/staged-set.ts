const submission = ref()

export const useStagedSet = async () => {
  const { data, refresh: reloadStagedSubmission } = await useApi('/set-submissions/curated', {
    key: `curated-submission`,
    dedupe: 'defer',
    immediate: false,
  })

  if (! submission.value) await reloadStagedSubmission()

  watchEffect(() => {
    // @ts-ignore
    submission.value = data.value?.submission
  })

  return {
    submission,
    reloadStagedSubmission,
  }
}

