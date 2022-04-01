// StarCraft map preview generator
// © MIT license

/** Presets for image generation. */
const generationPresets = {
  preview: {
    nameSuffix: 'preview',
    imgType: 'avif',
    imgSize: 1000
  },
  full: {
    nameSuffix: null,
    imgType: 'png',
    imgSize: null
  }
}

/** Supported output extensions. */
const generationExts = ['png', 'jpg', 'avif', 'webp']

module.exports = {
  generationPresets,
  generationExts
}
