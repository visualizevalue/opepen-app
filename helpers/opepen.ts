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

export const useOpepenMetadata = async (id: string|number) => {
  try {
    return await $fetch(`https://metadata.opepen.art/${id}/metadata.json`, { mode: 'no-cors' })
  } catch (e) {
    console.error(e)
    return null
  }
}
