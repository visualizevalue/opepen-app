export const useCoCreators = (submission: any) => {
  return computed(() => {
    const value = toValue(submission)
    if (!value?.coCreators) return []
    return value.coCreators.map((c: any) => c.account).filter(Boolean)
  })
}
