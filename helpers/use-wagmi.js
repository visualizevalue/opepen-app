import {
  getAccount,
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
  console.log('unwatchAccount', unwatchAccount)
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
