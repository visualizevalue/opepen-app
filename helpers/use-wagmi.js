import {
  fetchEnsAvatar,
  fetchEnsName,
  watchAccount,
} from '@wagmi/core'

const account = reactive({
  address: '',
  connector: null,
  isConnected: false,
  isConnecting: false,
  isDisconnected: false,
  isReconnecting: false,
  status: null,
})
let unwatchAccount;

export const useAccount = () => {
  if (! unwatchAccount) {
    unwatchAccount = watchAccount(updatedAccount => {
      account.address = updatedAccount.address
      account.connector = updatedAccount.connector
      account.isConnected = updatedAccount.isConnected
      account.isConnecting = updatedAccount.isConnecting
      account.isDisconnected = updatedAccount.isDisconnected
      account.isReconnecting = updatedAccount.isReconnecting
      account.status = updatedAccount.status
    })
  }

  return toRefs(account)
}

export const useEnsName = (address) => {
  const name = ref('')

  if (address.value) {
    fetchEnsName({ address: address.value }).then(ens => {
      name.value = ens
    })
  }
  watch(address, async () => {
    name.value = await fetchEnsName({ address: address.value })
  })

  return name
}

export const useEnsAvatar = (name) => {
  const avatar = ref('')

  if (name.value) {
    fetchEnsAvatar({ name: name.value }).then(url => avatar.value = url)
  }
  watch(name, async () => {
    if (! name.value) return
    avatar.value = await fetchEnsAvatar({ name: name.value })
  })

  return avatar
}
