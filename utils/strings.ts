export const cleanText = (str: string) => str?.replace(/<[^>]*>?/gm, '').trim() || ''

export const shortenedCleanText = (str: string, length: number = 80) => {
  const txt = cleanText(str)

  const nextSpaceIndex = txt.indexOf(' ', length)

  return txt.length > length && nextSpaceIndex > 0
    ? txt.substring(0, nextSpaceIndex) + '...'
    : txt
}

const urlPattern =
  /\b((http|https):\/\/)?(www\.)?([a-zA-Z0-9\-\.]+)\.([a-zA-Z]{2,})(\/[^\s]*)?\b/g
export const extractURLs = (str: string) => {
  return {
    text: str.replace(urlPattern, ''),
    urls: str.match(urlPattern),
  }
}

const zoraPattern = /\bhttps:\/\/zora\.co\/[^\s]+/g
export const enforceVVReferrer = (
  url: string,
  referrer = `0xc8f8e2F59Dd95fF67c3d39109ecA2e2A017D4c8a`,
) => {
  if (!zoraPattern.test(url)) {
    // Return the original url if it's not a zora url
    return url
  }

  try {
    const urlObj = new URL(url)
    urlObj.searchParams.set('referrer', referrer)
    return urlObj.toString()
  } catch (e) {
    console.error(`Invalid URL: ${url}`, e)
    // Return the original URL if there's an error
    return url
  }
}
