// StarCraft map preview generator
// © MIT license

const Chk = require('bw-chk')
const fs = require('fs').promises
const {createReadStream} = require('fs')
const {stripEscapeCodes} = require('sctoolsdata')
const path = require('path')
const scmExtractor = require('scm-extractor')
const filesize = require('filesize')
const filenamify = require('filenamify')
const {fileExists, ensureDir} = require('./util/fs')
const {encodeMapImage} = require('./image')

/**
 * Logs information about an image that was just generated or skipped.
 * 
 * TODO
 */
const logFeedback = (quiet, filepath, isSkipped, {imgType, width, height, start, size} = {}) => {
  if (quiet) {
    return
  }
  if (isSkipped) {
    return console.log(`Skipping existing image: ${filepath}`)
  }
  return console.log(`Generated image: ${filepath} (${imgType}, ${width}x${height}, ${+new Date() - start} ms, ${filesize(size)})`)
}

/**
 * Opens the Brood War graphics needed to render map files.
 */
const loadGraphics = gfxpath => {
  return Chk.fsFileAccess(gfxpath)
}

/**
 * Adds extra values to the output filename.
 */
const addSegmentsToFilename = (filename, mapname, extension, dataSegments) => {
  const fp = path.parse(filename)
  const segments = []
  if (dataSegments.multiple) {
    segments.push(`@${dataSegments.multiple}`)
  }
  if (dataSegments.suffix) {
    segments.push(dataSegments.suffix)
  }
  return [
    `${fp.dir ? `${fp.dir}/` : ''}`,
    `${filenamify(mapname ? mapname : fp.name, {replacement: '_'})}`,
    `${segments.length ? `-${segments.join('-')}` : ''}`,
    `.${extension}`
  ].join('')
}

/**
 * Resolves the output path for the file we want to generate.
 */
const pickFilename = (filepath, useInternalName, mapName, imgType, nameSuffix, outFlatten, pathRel, pathOut) => {
  // This utilizes both 'pathRel' and 'pathOut'; the output path is considered a base directory,
  // and we'll potentially create a directory structure inside of there.
  // For example: if, from the relative path, a map's location is foo/bar/baz.scx, we will
  // create <output path>/foo/bar/baz.png.
  // If 'outFlatten' is true, the directory structure is discarded.
  
  // To that effect, we first need to find the relative path.
  let relativePath = path.relative(pathRel, filepath)
  if (outFlatten) {
    relativePath = path.basename(relativePath)
  }

  // Now resolve this path using the output path if we have one.
  const resolvedPath = path.resolve(pathOut ? path.join(pathOut, relativePath) : relativePath)

  return addSegmentsToFilename(resolvedPath, useInternalName ? mapName : null, imgType, {suffix: nameSuffix})
}

/**
 * Generates an image stream from a bw-chk map object.
 * 
 * The given 'multiple' value should be one of [32, 16, 8] and denotes the base tile size.
 * By default, 32 is used, which is fully zoomed in per Brood War resolution.
 */
const renderMapImageData = async (gfxObj, mapObj, mul = 32) => {
  const mapImg = await mapObj.image(gfxObj, mapObj.size[0] * mul, mapObj.size[1] * mul)
  return [mapImg, mapObj.size[0] * mul, mapObj.size[1] * mul]
}

/**
 * Reads a map file and resolves with its CHK data.
 */
const readMapCHK = filepath => new Promise((resolve, reject) => {
  const file = createReadStream(filepath)
  const mpq = file.pipe(scmExtractor())
  mpq.pipe(Chk.createStream((err, chk) => {
    if (err) {
      return reject(err)
    }
    resolve(chk, filepath)
  }))
  mpq.on('error', err => {
    reject(err)
  })
  file.on('error', err => {
    reject(err)
  })
})

/**
 * Generates a map preview per a given number of options.
 * 
 * TODO
 */
const generateMapPreview = async (file, gfx, {imgSkip, imgType, imgSize, useInternalName, nameSuffix, outFlatten, outQuiet, pathRel, pathOut = null} = {}) => {
  const fileRel = pathRel ? path.relative(pathRel, file) : file
  const start = new Date()
  const map = await readMapCHK(file)
  const target = pickFilename(file, useInternalName, stripEscapeCodes(map.title), imgType, nameSuffix, outFlatten, pathRel, pathOut)
  const exists = await fileExists(target)
  if (exists && imgSkip) {
    logFeedback(outQuiet, fileRel, true)
    return
  }
  const [img, width, height] = await renderMapImageData(gfx, map, 32, file)
  const buffer = await encodeMapImage(imgType, img, width, height, imgSize)
  await ensureDir(path.dirname(target))
  await fs.writeFile(target, buffer, null)
  logFeedback(outQuiet, pathRel ? path.relative(pathRel, target) : target, false, {imgType, width, height, start, size: Buffer.byteLength(buffer)})
}

module.exports = {
  addSegmentsToFilename,
  generateMapPreview,
  loadGraphics,
  logFeedback,
  pickFilename,
  readMapCHK,
  renderMapImageData
}
