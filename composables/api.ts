export const useApi = async <T>(endpoint: Ref<string>|string, options = {}) => {
  return await useFetch<T>(`${useConfig('opepenApi')}${isRef(endpoint) ? endpoint.value : endpoint}`, {
    dedupe: 'defer',
    ...options,
  })
}

export const useApiPost = async <T>(endpoint: Ref<string>|string, options = {}) => {
  return await useApi<T>(endpoint, {
    method: 'POST',
    credentials: 'include',
    immediate: false,
    ...options
  })
}

export const useApiDelete = async <T>(endpoint: Ref<string>|string, options = {}) => {
  return await useApiPost<T>(endpoint, {
    method: 'DELETE',
    immediate: false,
    watch: false,
    ...options
  })
}

