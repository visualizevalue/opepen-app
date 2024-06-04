import { signMessage } from '@wagmi/core'
import { address, useAccount } from './use-wagmi'

type Session = {
  address: string;
  chainId: number;
  domain: string;
  issuedAt: string;
  nonce: string;
  statement: string;
  uri: string;
  version: string;
}

export const ADMIN_ADDRESSES = [
  '0xe11da9560b51f8918295edc5ab9c0a90e9ada20b',
  '0xc8f8e2f59dd95ff67c3d39109eca2e2a017d4c8a',
  '0x412c84b454ee700cb22d1a7d214eb5bad1ba19b4',
  '0x1d4c8282a408d8fe92496cccd1eaa4ff0fdd3b97',
]

export const loading = ref(false)
export const signingIn = ref(false)
export const nonce = ref('')
export const session: Ref<Session|null> = ref(null)
export const isAuthenticated = computed(() => address.value && session.value?.address?.toLowerCase() === address.value?.toLowerCase())
export const isAdmin = computed(() => ADMIN_ADDRESSES.includes(session.value?.address.toLowerCase() || ''))

let accountWatcher: any

export const loadSiwe = async () => {
  return import('siwe')
}

export const siweMessage = async (address: string) => {
  const domain = window.location.host
  const origin = window.location.origin

  const { SiweMessage } = await loadSiwe()

  const message = new SiweMessage({
    domain,
    address,
    statement: 'Opepen Check-In Check Check.',
    uri: origin,
    version: '1',
    chainId: 1,
    nonce: nonce.value,
  })

  return message
}

export const useSignIn = () => {
  const config = useRuntimeConfig()
  const { address } = useAccount()
  const API = config.public.opepenApi

  const fetchMe = async () => {
    session.value = await $fetch(`${API}/auth/me`, {
      credentials: 'include',
    })
  }

  const fetchNonce = async () => {
    try {
      const data: { nonce: string } = await $fetch(`${API}/auth/nonce`, {
        credentials: 'include'
      })

      nonce.value = data.nonce

      return data.nonce
    } catch (e) {
      nonce.value = ''

      return nonce.value
    }
  }

  const signIn = async () => {
    loading.value = true

    if (! address.value) {
      // @ts-ignore
      document.querySelector('#main-connect')?.click()

      return false
    }

    // Check if we have a valid session
    try {
      await fetchMe()
      if (isAuthenticated.value) {
        loading.value = false

        // We're already signed in
        return true
      }
    } catch (e) {}

    try {
      signingIn.value = true

      // Fetch current nonce
      await fetchNonce()

      // Get user confirmation
      const message = await siweMessage(address.value)
      const signature = await signMessage({
        message: message.prepareMessage()
      })

      // Verify session
      session.value = await $fetch(`${API}/auth/verify`, {
        method: 'POST',
        credentials: 'include',
        body: JSON.stringify({ message, signature })
      })
    } catch (e) {}

    signingIn.value = false
    loading.value = false
  }

  if (! accountWatcher) {
    // If the current selected ethereum account is changed (e.g. within the users' wallet), we reauthenticate.
    accountWatcher = watch(address, (_, prevAccount) => {
      if (prevAccount) {
        signIn()
      }
    })
  }

  return {
    signIn,
    fetchNonce,
    fetchMe,
    loading,
    signingIn,
    nonce,
    session,
  }
}
