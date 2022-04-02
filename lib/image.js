// StarCraft map preview generator
// © MIT license

const sharp = require('sharp')

/**
 * Converts a bitmap into an image buffer of a given type.
 */
const encodeMapImage = async (type, bitmap, width, height, targetSize) => {
  const image = await sharp(bitmap, {raw: {width, height, channels: 3}})
  let finalWidth = width
  let finalHeight = height

  if (targetSize) {
    await image.resize({width: targetSize, height: targetSize, fit: 'inside'})
  }

  if (type === 'jpg') {
    await image.jpeg({mozjpeg: true, quality: 94, chromaSubsampling: '4:4:4'})
  }
  else if (type === 'png') {
    await image.png({compressionLevel: 9})
  }
  else if (type === 'avif') {
    await image.avif({quality: 80, chromaSubsampling: '4:4:4'})
  }
  else {
    throw new Error(`image type "${type}" not supported`)
  }

  const buffer = await image.toBuffer()

  // Obtain the actual width/height of the image after resizing.
  // Is there an easier way to do this?
  if (targetSize) {
    const resizedImage = await sharp(buffer).metadata()
    finalWidth = resizedImage.width
    finalHeight = resizedImage.height
  }
  
  return [buffer, finalWidth, finalHeight]
}

module.exports = {
  encodeMapImage
}
