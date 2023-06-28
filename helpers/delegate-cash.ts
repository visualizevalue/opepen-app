import { providers } from 'ethers'
import { DelegateCash } from 'delegatecash'
import { fetchSigner } from '@wagmi/core'
import { delay } from './time'

export async function fetchAddresses (rpc: string): Promise<string[]> {
  const signer = await fetchSigner()
  if (! signer) {
    await delay(1_000)
    return fetchAddresses(rpc)
  }

  const dc = new DelegateCash(new providers.JsonRpcProvider(rpc, 'any'))

  const delegations = await dc.getDelegationsByDelegate(await signer.getAddress())

  const applicableDelegations = delegations.filter(d =>
    d.type === 'ALL' || (
      d.type === 'CONTRACT' &&
      d.contract?.toLowerCase() === `0x6339e5e072086621540d0362c4e3cea0d643e114`
    )
  )

  return applicableDelegations.map(d => d.vault)
}
