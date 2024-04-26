import {
  fetchEnsAvatar,
  fetchEnsName,
  getAccount,
  watchAccount,
  watchBlockNumber,
} from '@wagmi/core'
import { id as computeId } from '~/helpers/accounts'

const config = useRuntimeConfig()

const account = reactive({
  address: '',
  ens: null,
  connector: null,
  isConnected: false,
  isConnecting: false,
  isDisconnected: false,
  isReconnecting: false,
  status: null,
  profile: null,
})
const setAccount = async a => {
  account.address = a.address
  account.connector = a.connector
  account.isConnected = a.isConnected
  account.isConnecting = a.isConnecting
  account.isDisconnected = a.isDisconnected
  account.isReconnecting = a.isReconnecting
  account.status = a.status
  account.profile = await $fetch(`${config.public.opepenApi}/accounts/${account.address}`)
}
export const address = computed(() => account.address)
export const id = computed(() => computeId(account.profile))
let unwatchAccount;

export const useAccount = () => {
  if (! unwatchAccount) {
    // try to get our initial account
    setAccount(getAccount())

    // set up the watcher
    unwatchAccount = watchAccount(setAccount)
  }

  return toRefs(account)
}

const ProfileCache = new Map()

export const useProfile = async (address) => {
  const config = useRuntimeConfig()
  const profile = ref(null)

  const fetchProfile = async (a) => {
    if (a === profile.address) return

    profile.value = ProfileCache.has(address.value)
      ? ProfileCache.get(address.value)
      : await $fetch(`${config.public.opepenApi}/accounts/${a}`)

    ProfileCache.set(address.value, profile.value)
  }
  onMounted(() => fetchProfile(address.value))
  watch(address, () => fetchProfile(address.value))

  return profile
}

export const useEnsName = (address) => {
  if (address.value) {
    fetchEnsName({ address: address.value }).then(ens => {
      account.ens = ens
    })
  }
  watch(address, async () => {
    account.ens = await fetchEnsName({ address: address.value })
  })

  return toRef(account.ens)
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

const blockHeight = ref(null)
let unwatchBlockHeight
export const useBlockHeight = () => {
  unwatchBlockHeight = watchBlockNumber(
    { chainId: 1, listen: true },
    (blockNumber) => {
      blockHeight.value = blockNumber
    }
  )

  return blockHeight
}
