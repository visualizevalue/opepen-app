export const useStagedSet = async () => {
  const { data, refresh: reloadStagedSubmission } = await useApi('/set-submissions/curated', {
    key: `curated-submission`,
    dedupe: 'defer',
  })

  const submission = computed(() => data.value?.submission)

  return {
    submission,
    reloadStagedSubmission,
  }
}

