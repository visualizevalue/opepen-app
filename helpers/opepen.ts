export const useFetchOpepen = () => {
  const config = useRuntimeConfig()
  const uri = `${config.public.opepenApi}/opepen`

  const buildQuery = (query: string) => {
    let q = `filter[revealed_at]=!null`

    if (query) q += ('&' + query)

    return q
  }

  const fetchOpepen = async ({ query }: { query: string }) => {
    return $fetch(uri + '?' + buildQuery(query))
  }

  return {
    fetchOpepen
  }
}
