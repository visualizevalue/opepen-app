export const cleanText = (str: string) => str?.replace(/<[^>]*>?/gm, '')

export const shortenedCleanText = (str: string, length: number = 80) => {
  const txt = cleanText(str)

  return txt.length > length ? txt.substring(0, length) + '...' : txt
}
