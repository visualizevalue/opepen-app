export const formatNumber = (num: number) => num?.toLocaleString('en-US')

export const roundAndFormatNumber = (num: number, decimals: number = 2) => {
  const multiplier = Math.pow(10, decimals)
  const rounded = Math.round(num * multiplier) / multiplier
  return formatNumber(rounded === num ? num : rounded)
}

