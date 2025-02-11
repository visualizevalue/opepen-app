export const useApi = (endpoint: string, options = {}) => {
  return useFetch(`${useConfig('opepenApi')}${endpoint}`, options)
}

