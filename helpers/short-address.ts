const shortAddress = (address: string, length = 4) => address &&
  (
    address.substring(0, length + 2) +
    '...' +
    address.substring(address.length - length)
  ) || ''

export default shortAddress
