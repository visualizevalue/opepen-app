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

  const name = (!isAnimated && version && image.versions[version]) ? `${image.uuid}@${version}` : image.uuid

  return `${image.cdn}/${image.path}/${name}.${image.type}`
}
