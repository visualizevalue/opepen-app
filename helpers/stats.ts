export const useStats = async () => {
  const config = useRuntimeConfig()

  return await useFetch(`${config.public.opepenApi}/stats`, { key: 'stats' })
}
