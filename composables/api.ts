export const useApi = async (endpoint: Ref<string>|string, options = {}) => {
  return await useFetch(`${useConfig('opepenApi')}${isRef(endpoint) ? endpoint.value : endpoint}`, {
    dedupe: 'defer',
    ...options,
  })
}

export const useApiPost = async (endpoint: Ref<string>|string, options = {}) => {
  return await useApi(endpoint, {
    method: 'POST',
    credentials: 'include',
    immediate: false,
    ...options
  })
}

export const useApiDelete = async (endpoint: Ref<string>|string, options = {}) => {
  return await useApiPost(endpoint, {
    method: 'DELETE',
    ...options
  })
}

