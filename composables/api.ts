export const useApi = async (endpoint: string|Ref<string>, options = {}) => {
  return await useFetch(`${useConfig('opepenApi')}${endpoint}`, options)
}

export const useApiPost = async (endpoint: string, options = {}) => {
  return await useApi(endpoint, {
    method: 'POST',
    credentials: 'include',
    immediate: false,
    ...options
  })
}

export const useApiDelete = async (endpoint: string, options = {}) => {
  return await useApiPost(endpoint, {
    method: 'DELETE',
    ...options
  })
}

