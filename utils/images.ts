export const isAnimated = (type: string) => ['mp4', 'webm', 'gif'].includes(type)
export const is3d = (type: string) =>
  ['gbl', 'gltf', 'glb-json', 'glb-binary', 'gltf-json', 'gltf-binary'].includes(type)
export const isWebRendered = (type: string) => ['html', 'svg'].includes(type)

export const imageURI = (image: Image, version?: keyof ImageVersions) => {
  if (!image) return null

  const name = version ? `${image.uuid}@${version}` : image.uuid
  const type =
    (isAnimated(image?.type) || is3d(image?.type) || isWebRendered(image?.type)) && version
      ? `png`
      : image.type

  return `${image.cdn}/${image.path}/${name}.${type}`
}

export const DEFAULT_TOKEN_IMAGE = `https://opepen.nyc3.cdn.digitaloceanspaces.com/token.svg`
