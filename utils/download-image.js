export const loadImage = url => new Promise(resolve => {
  const img = new Image()
  img.crossOrigin = 'anonymous'
  img.src = url
  img.onload = () => resolve(img)
})

export const image2Blob = (canvas, mime, quality) =>
  new Promise(resolve => canvas.toBlob(resolve, mime, quality))

export const canvas2URI = async (canvas) => {
  const URLObj = window.URL || window.webkitURL
  return URLObj.createObjectURL(await image2Blob(canvas, 'image/png'))
}

export const downloadCanvas = async (
  name,
  canvas,
  mime = 'image/png',
  quality = 0.8
) => {
  // Get the blob
  const image = await image2Blob(canvas, mime, quality)

  // Virtual link download
  let URLObj = window.URL || window.webkitURL
  let a = document.createElement('a')
  a.href = URLObj.createObjectURL(image)
  a.download = name.endsWith('.png') ? name : `${name}.png`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}

const downloadImage = async (url, {
  name = url,
  mime = 'image/png',
  quality = 0.8,
} = {}) => {
  // Load the image
  const img = await loadImage(url)

  // Set up canvas
  const canvas = document.createElement('canvas')
  canvas.width = img.naturalWidth
  canvas.height = img.naturalHeight
  const ctx = canvas.getContext('2d')

  // Draw the image
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

  await downloadCanvas(name, canvas, mime, quality)
}

export default downloadImage
