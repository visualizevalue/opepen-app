type DelegationV1 = {
  type: "NONE" | "ALL" | "CONTRACT" | "TOKEN";
  vault: string;
  delegate: string;
  contract: string | null;
  tokenId: number | null;
}
type DelegationV2 = {
  type: "NONE" | "ALL" | "CONTRACT" | "TOKEN";
  from: string;
  to: string;
  contract: string | null;
  tokenId: number | null;
}

export async function fetchAddresses (account?: string): Promise<string[]> {
  if (! account) return []

  try {
    const [delegationsV1, delegationsV2] = await Promise.all([
      $fetch(`https://api.delegate.xyz/registry/v1/${account}`) as Promise<DelegationV1[]>,
      $fetch(`https://api.delegate.xyz/registry/v2/${account}`) as Promise<DelegationV2[]>,
    ])

    const filterApplicable = (d: DelegationV1|DelegationV2) => d.type === 'ALL' || (
      d.type === 'CONTRACT' &&
      d.contract?.toLowerCase() === `0x6339e5e072086621540d0362c4e3cea0d643e114`
    )

    const applicableV1 = delegationsV1.filter(filterApplicable).map(d => d.vault.toLowerCase() === account.toLowerCase() ? d.delegate : d.vault)
    const applicableV2 = delegationsV2.filter(filterApplicable).map(d => d.to.toLowerCase() === account.toLowerCase() ? d.from : d.to)

    return Array.from(new Set(applicableV1.concat(applicableV2).map(a => a.toLowerCase())))
  } catch (e) {
    console.log(`Failed fetching delegations`)
    return []
  }
}
