import { signMessage } from '@wagmi/core'
import { useAccount } from './use-wagmi'

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

export const loading = ref(false)
export const nonce = ref('')
export const session: Ref<Session|null> = ref(null)

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
    const data: { nonce: string } = await $fetch(`${API}/auth/nonce`, {
      credentials: 'include'
    })

    nonce.value = data.nonce

    return data.nonce
  }

  const signIn = async () => {
    loading.value = true

    if (! address.value) return

    // Check if we have a valid session
    try {
      await fetchMe()
      if (session.value && session.value.address.toLowerCase() === address.value.toLowerCase()) {
        loading.value = false

        // We're already signed in
        return
      }
    } catch (e) {}

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

    loading.value = false
  }

  if (! accountWatcher) {
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
    nonce,
    session,
  }
}
