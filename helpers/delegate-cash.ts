import { ethers } from 'ethers'
import { DelegateCash } from 'delegatecash'
import { fetchSigner } from '@wagmi/core'
import { delay } from './time'

export async function fetchAddresses (): Promise<string[]> {
  const signer = await fetchSigner()
  if (! signer || ! signer.provider) {
    await delay(1_000)
    return fetchAddresses()
  }

  const dc = new DelegateCash(signer.provider as unknown as ethers.providers.Web3Provider)

  const delegations = await dc.getDelegationsByDelegate(await signer.getAddress())

  const applicableDelegations = delegations.filter(d =>
    d.type === 'ALL' || (
      d.type === 'CONTRACT' &&
      d.contract?.toLowerCase() === `0x6339e5e072086621540d0362c4e3cea0d643e114`
    )
  )

  return applicableDelegations.map(d => d.vault)
}
