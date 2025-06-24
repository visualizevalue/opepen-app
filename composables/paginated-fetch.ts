export const fetchPaginated = async (endpoint: string) => {
  const config = useRuntimeConfig()
  const results: any[] = []
  let page = 1

  while (true) {
    const response = await $fetch<{ data: any[]; meta?: { last_page: number } }>(
      `${config.public.opepenApi}${endpoint}?page=${page}`,
    )
    const data = response.data || response
    results.push(...data)

    if (!response.meta || page >= response.meta.last_page) break
    page++
  }

  return results
}
