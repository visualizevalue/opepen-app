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
  width = 1080,
  aspectRatio = 1,
  height = width * aspectRatio,
  canvasWidth = parseInt(width),
  canvasHeight = parseInt(height),
  backgroundColor = null,
  sharp = true,
  mime = 'image/png',
  quality = 0.8,
}) => {
  const canvas = document.createElement('canvas')
  canvas.width = canvasWidth
  canvas.height = canvasHeight
  const ctx = canvas.getContext('2d')
  if (sharp) {
    ctx.webkitImageSmoothingEnabled = false
    ctx.mozImageSmoothingEnabled = false
    ctx.imageSmoothingEnabled = false
  }

  if (backgroundColor) {
    ctx.fillStyle = backgroundColor
    ctx.fillRect(0, 0, canvasWidth, canvasHeight)
  }

  // Load and the image
  const img = await loadImage(url)
  ctx.drawImage(img, (canvasWidth - width) / 2, (canvasHeight - height) / 2, width, height)

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
