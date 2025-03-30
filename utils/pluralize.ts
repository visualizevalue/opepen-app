export const pluralize = (word: string, count: number, pluralForm?: string): string =>
  count === 1 ? word : pluralForm || `${word}s`

const numberWords: { [key: number]: string } = {
  0: 'zero',
  1: 'one',
  2: 'two',
  3: 'three',
  4: 'four',
  5: 'five',
  6: 'six',
  7: 'seven',
  8: 'eight',
  9: 'nine',
  10: 'ten',
  11: 'eleven',
  12: 'twelve',
}

export const enumerate = (word: string, count: number, pluralForm?: string): string => {
  const numText = count <= 12 ? numberWords[count] || count.toString() : count.toString()

  return `${numText} ${pluralize(word, count, pluralForm)}`
}
