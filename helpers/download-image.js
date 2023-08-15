export const loadImage = url => new Promise(resolve => {
  const img = new Image()
  img.crossOrigin = 'anonymous'
  img.src = url
  img.onload = () => resolve(img)
})

export const image2Blob = (canvas, mime, quality) =>
  new Promise(resolve => canvas.toBlob(resolve, mime, quality))

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

  // Get the blob
  const image = await image2Blob(canvas, mime, quality)

  // Virtual link download
  let URLObj = window.URL || window.webkitURL
  let a = document.createElement('a')
  a.href = URLObj.createObjectURL(image)
  a.download = `${name}.png`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}

export default downloadImage
