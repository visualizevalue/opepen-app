import { signMessage, getAccount, watchAccount } from '@wagmi/core'
import { createSiweMessage } from 'viem/siwe'

type Session = {
  address: string;
  chainId: number;
  domain: string;
  issuedAt: string;
  nonce: string;
  statement: string;
  uri: string;
  version: string;
  is_admin: boolean;
}

const nonce = ref('')
export const currentAddress = ref('')
export const signInLoading = ref(false)
export const signingIn = ref(false)
export const signInFailed = ref(false)
export const session: Ref<Session|null> = ref(null)
export const isAuthenticated = computed(() => session.value && session.value.address?.toLowerCase() === currentAddress.value?.toLowerCase())
export const isAdmin = computed(() => session.value?.is_admin)

let accountWatcher: any

export const siweMessage = (address: string) => createSiweMessage({
  domain: window.location.host,
  uri: window.location.origin,
  address,
  chainId: 1,
  nonce: nonce.value,
  version: '1',
})

export const useSignIn = () => {
  const { $wagmi } = useNuxtApp()
  const config = useRuntimeConfig()
  const API = config.public.opepenApi

  if (! accountWatcher) {
    currentAddress.value = getAccount($wagmi)?.address
    fetchMe()

    // Set up the singleton account watcher
    accountWatcher = watchAccount($wagmi, {
      onChange(account, prevAccount) {
        currentAddress.value = account.address

        // If the current selected ethereum account is changed
        // (e.g. within the users' wallet), we reauthenticate.
        if (prevAccount && prevAccount.address !== account.address) {
          session.value = null
          ensureSignIn()
        }
      },
    })
  }

  async function fetchMe () {
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
    signInLoading.value = true
    signInFailed.value = false

    if (! currentAddress.value) {
      // @ts-ignore
      document.querySelector('.main-connect')?.click()

      signInLoading.value = false
      return false
    }

    // Check if we have a valid session
    try {
      await fetchMe()
      if (isAuthenticated.value) {
        signInLoading.value = false

        // We're already signed in
        return true
      }
      if (currentAddress.value && ! isAuthenticated.value) {
        await $fetch(`${API}/auth/clear`, { credentials: 'include' })
      }
    } catch (e) {}

    try {
      signingIn.value = true

      // Fetch current nonce
      await fetchNonce()

      // Get user confirmation
      const message = siweMessage(currentAddress.value)
      const signature = await signMessage($wagmi, {
        message,
      })

      // Verify session
      session.value = await $fetch(`${API}/auth/verify`, {
        method: 'POST',
        credentials: 'include',
        body: JSON.stringify({ message, signature })
      })
    } catch (e) {
      console.error(e)
      signInFailed.value = true
    }

    signingIn.value = false
    signInLoading.value = false
  }

  const ensureSignIn = async () => {
    if (! isAuthenticated.value && ! signInLoading.value) {
      await signIn()
      if (! isAuthenticated.value) {
        throw new Error(`Not Authenticated`)
      }
    }
  }

  return {
    signIn,
    ensureSignIn,
    fetchNonce,
    fetchMe,
    signInLoading,
    signingIn,
    nonce,
    session,
  }
}
