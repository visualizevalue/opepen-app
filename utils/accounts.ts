export const ADDRESS_ZERO = `0x0000000000000000000000000000000000000000`

export const normalizeENS = (ens?: string) => (ens && ens.endsWith('.eth')) ? ens.slice(0, -4) : ens

export const id = (account: Account) => {
  return account && (normalizeENS(account.ens) || account.address)
}

export const shortAddress = (address: string, length = 4) => address &&
  (
    address.substring(0, length + 2) +
    '...' +
    address.substring(address.length - length)
  ) || ''
