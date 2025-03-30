export enum EditionType {
  One = 1,
  Four = 4,
  Five = 5,
  Ten = 10,
  Twenty = 20,
  Forty = 40,
}

export const EDITION_KEYS: EditionType[] = [
  EditionType.One,
  EditionType.Four,
  EditionType.Five,
  EditionType.Ten,
  EditionType.Twenty,
  EditionType.Forty,
]

export interface Edition {
  name: string
  tagline: string
}

export const EDITIONS: Record<EditionType, Edition> = {
  [EditionType.One]: { name: 'One', tagline: 'One of One' },
  [EditionType.Four]: { name: 'Four', tagline: 'Four Editions' },
  [EditionType.Five]: { name: 'Five', tagline: 'Five Editions' },
  [EditionType.Ten]: { name: 'Ten', tagline: 'Ten Editions' },
  [EditionType.Twenty]: { name: 'Twenty', tagline: 'Twenty Editions' },
  [EditionType.Forty]: { name: 'Forty', tagline: 'Forty Editions' },
}

export function getEditionName(key: EditionType): string {
  return EDITIONS[key].name
}

export function getEditionNameLower(key: EditionType): string {
  return EDITIONS[key].name.toLowerCase()
}
