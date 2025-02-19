let accountWatcher: any
const account = ref()

export const useProfile = async () => {
  const refreshAccount = async () => {
    if (! currentAddress.value) {
      account.value = null
    } else {
      account.value = await $fetch(`${useConfig('opepenApi')}/accounts/${currentAddress.value}`)
    }
  }
  if (! accountWatcher) {
    accountWatcher = watch(currentAddress, () => refreshAccount())
  }

  if (! import.meta.server && ! account.value?.address) {
    await refreshAccount()
  }

  return {
    account,
    refreshAccount,
  }
}

