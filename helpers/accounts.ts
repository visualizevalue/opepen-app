export const normalizeENS = (ens?: string) => (ens && ens.endsWith('.eth')) ? ens.slice(0, -4) : ens

export const id = (account: { address: string, ens: string }) => {
  return normalizeENS(account.ens) || account.address
}
