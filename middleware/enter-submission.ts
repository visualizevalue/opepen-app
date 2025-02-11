export default defineNuxtRouteMiddleware(async (to) => {
  if (isSetId(to.params.id)) {
    return navigateTo(`/sets/${to.params.id}`)
  }

  const { data: submission } = await useApi(`/set-submissions/${to.params.id}`)

  if (submission.value?.set_id) {
    return navigateTo(
      `/sets/${pad(submission.value.set_id)}`,
      { redirectCode: 301 }
    )
  }
})

