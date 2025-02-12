export const useApi = async (endpoint: string, options = {}) => {
  return await useFetch(`${useConfig('opepenApi')}${endpoint}`, options)
}

