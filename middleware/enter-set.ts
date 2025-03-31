export default defineNuxtRouteMiddleware(async (to) => {
  if (!isSetId(to.params.id)) {
    return navigateTo(`/submissions/${to.params.id}`, { redirectCode: 301 })
  }
})
