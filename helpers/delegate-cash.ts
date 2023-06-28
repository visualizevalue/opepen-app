import { providers } from 'ethers'
import { DelegateCash } from 'delegatecash'

export async function fetchAddresses (rpc: string, account?: string): Promise<string[]> {
  if (! account) return []

  const dc = new DelegateCash(new providers.JsonRpcProvider(rpc, 'any'))

  const delegations = await dc.getDelegationsByDelegate(account)

  const applicableDelegations = delegations.filter(d =>
    d.type === 'ALL' || (
      d.type === 'CONTRACT' &&
      d.contract?.toLowerCase() === `0x6339e5e072086621540d0362c4e3cea0d643e114`
    )
  )

  return applicableDelegations.map(d => d.vault)
}
