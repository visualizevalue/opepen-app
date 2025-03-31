import { http } from 'viem'
import { DelegateV2, type V1Delegation, type V2Delegation } from '@delegatexyz/sdk'

const filterApplicable = (d: V1Delegation | V2Delegation) =>
  d.type === 'ALL' ||
  (['CONTRACT', 'ERC721'].includes(d.type) &&
    d.contract?.toLowerCase() === `0x6339e5e072086621540d0362c4e3cea0d643e114`)

export const useDelegation = async (address: Ref<`0x${string}`>) => {
  const config = useRuntimeConfig()
  const addresses: Ref<string[]> = ref([])
  const tokenIds: Ref<number[]> = ref([])

  // @ts-ignore
  const v2 = new DelegateV2(http(config.public.rpc))

  const update = async () => {
    if (!address.value) {
      console.debug(`Abort fetching delegation for null address`)
      return
    }

    const incoming = await v2.getIncomingDelegations(address.value)

    const applicable = incoming.filter(filterApplicable)

    addresses.value = Array.from(new Set(applicable.map((d) => d.from?.toLowerCase())))

    tokenIds.value = Array.from(
      new Set(applicable.filter((d) => d.type === 'ERC721').map((d) => d.tokenId)),
    )
  }

  await update()
  watch(address, () => update())

  return {
    addresses,
    tokenIds,
    update,
  }
}
