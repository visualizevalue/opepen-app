export const formatNumber = (num: number) => num?.toLocaleString('en-US')

export const roundAndFormatNumber = (num: number, decimals: number = 2) => {
  const multiplier = Math.pow(10, decimals)
  const rounded = Math.round(num * multiplier) / multiplier
  return formatNumber(rounded === num ? num : rounded)
}

export const asPercentageOf = (num: number = 0, base: number = 1) => {
  return formatNumber(Math.round((num / base) * 100))
}

export function formatUSD(value: string | number, fractionDigits: number = 0): string {
  const numberValue = typeof value === 'string' ? parseFloat(value) : value

  if (isNaN(numberValue)) {
    throw new Error('Invalid number input')
  }

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(numberValue)
}
