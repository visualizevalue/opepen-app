export const useCoCreators = (submission: any) => {
  return computed(() => {
    if (!submission?.coCreators) return []
    return submission.coCreators
      .map((c: any) => c.account)
      .filter(Boolean)
  })
}
