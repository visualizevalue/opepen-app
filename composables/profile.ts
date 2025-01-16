export const useProfile = async (id: Ref<string>) => {
  const config = useRuntimeConfig()

  const account = ref()

  const url = computed(() => `${config.public.opepenApi}/accounts/${id.value}`)
  const { data } = await useFetch(url)

  watchEffect(() => {
    account.value = data.value
  })

  return account
}

