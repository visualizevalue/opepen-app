export const normalizeURI = (url: string) =>
  url.replace('ipfs://', 'https://ipfs.vv.xyz/ipfs/')

export const validateURI = (url: string) => {
  if (!url || !url.length) return false

  let validated = url.trim()

  // Normalize protocol
  if (!validated.startsWith('https://')) validated = `https://${validated}`
  if (!validated.startsWith('http')) validated = `http://${validated}`

  // Check url validity
  try {
    new URL(validated)
  } catch (e) {
    return false
  }

  return validated
}

export const getMainDomain = (url: string) => {
  const regex = /^(?:https?:\/\/)?(?:www\.)?([^\/\n]+)/i
  const match = url.match(regex)
  return match ? match[1] : null
}

export const getFirstSubpath = (url: string) => {
  try {
    // This will throw an error if the URL is not valid
    const parsedUrl = new URL(url)
    const pathname = parsedUrl.pathname

    // Remove the leading slash and split by slash to get path segments
    const pathSegments = pathname.replace(/^\//, '').split('/')

    // Return the first path segment, if there is one
    return pathSegments.length > 0 ? pathSegments[0] : null
  } catch (e) {
    // The URL is invalid
    return null
  }
}

export const getUserNameFromSubpath = (url: string) => {
  const subpath = getFirstSubpath(url)
  return subpath?.startsWith('@') ? subpath : `@${subpath}`
}

export const isUUID = (value: string | number) => {
  const s = `${value}`
  const n = parseInt(s)

  return s.length > 3 && n.toString() !== s
}

export const isSetId = (value: string | number) => {
  const n = parseInt(`${value}`)
  return !isUUID(value) && n <= 200
}
