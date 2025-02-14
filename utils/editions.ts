export const EDITION_NAMES = {
  1: 'One',
  4: 'Four',
  5: 'Five',
  10: 'Ten',
  20: 'Twenty',
  40: 'Forty',
}

export const EDITION_TAGLINES = {
  '1': 'One of One',
  '4': 'Four Editions',
  '5': 'Five Editions',
  '10': 'Ten Editions',
  '20': 'Twenty Editions',
  '40': 'Forty Editions',
}

export const getEditionName = (key: keyof typeof EDITION_NAMES) => EDITION_NAMES[key]

export const getEditionNameLower = (key: keyof typeof EDITION_NAMES) => EDITION_NAMES[key].toLowerCase()

