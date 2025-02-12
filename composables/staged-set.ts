export const useStagedSet = async () => {
  const { data, refresh: reloadStagedSubmission } = await useApi('/set-submissions/curated')

  const submission = computed(() => data.value?.submission)

  return {
    submission,
    reloadStagedSubmission,
  }
}

