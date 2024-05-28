type ImageVersions = {
  sm?: boolean, // 512
  lg?: boolean, // 1024
  xl?: boolean, // 2048
}

type Image = {
  uuid: string,
  versions: ImageVersions,
  cdn: string,
  path: string,
  type: string,
}

export const imageURI = (image: Image, version?: keyof ImageVersions) => {
  if (! image) return null

  const isAnimated = ['mp4', 'webm', 'gif'].includes(image?.type)

  const name = (version && image.versions[version]) ? `${image.uuid}@${version}` : image.uuid
  const type = ((isAnimated || 'svg') && version) ? `png` : image.type

  return `${image.cdn}/${image.path}/${name}.${type}`
}
