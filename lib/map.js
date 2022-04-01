// StarCraft map preview generator
// © MIT license

const Chk = require('bw-chk')
const fs = require('fs').promises
const {createReadStream} = require('fs')
const {stripEscapeCodes, parseMapName} = require('sctoolsdata')
const path = require('path')
const scmExtractor = require('scm-extractor')
const filesize = require('filesize')
const filenamify = require('filenamify')
const {fileExists, ensureDir} = require('./util/fs')
const {encodeMapImage} = require('./image')

/**
 * Logs information about an image that was just generated or skipped.
 */
const logFeedback = (quiet, filepath, skipExists, skipObs, {imgType, width, height, start, size} = {}) => {
  if (quiet) {
    return
  }
  if (skipExists || skipObs) {
    return console.log(`Skipping ${skipExists ? 'existing' : 'observer map'} image: ${filepath}`)
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
    `${filenamify(mapname ? mapname : fp.name, {replacement: '_'}).trim()}`,
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

  // Parse the internal map name and use it if required.
  const nameParsed = parseMapName(mapName)

  return [addSegmentsToFilename(resolvedPath, useInternalName ? nameParsed.cleanName : null, imgType, {suffix: nameSuffix}), nameParsed]
}

/**
 * Returns whether a given map is an observer map.
 */
const isObsMap = (filepath, mapName) => {
  const parsed = path.parse(filepath)
  return /\(Ob\)/.test(parsed.name) || mapName.isObserverMap
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
 * Essentially all the work is done here in sequence. First, the map's CHK data is read,
 * which contains all the actual tile, unit and sprite information. Then, a target filename
 * is produced (potentially based on the internal map name, which we obtain while parsing the CHK data).
 * A full-size image is produced, which is then optionally scaled down, and finally saved to the target.
 * 
 * Unless --quiet is passed, each image's status will be logged upon completion.
 */
const generateMapPreview = async (file, gfx, {obsSkip, imgSkip, imgType, imgSize, useInternalName, nameSuffix, outFlatten, outQuiet, pathRel, pathOut = null} = {}) => {
  const fileRel = pathRel ? path.relative(pathRel, file) : file
  const start = new Date()
  const map = await readMapCHK(file)
  const [target, mapName] = pickFilename(file, useInternalName, stripEscapeCodes(map.title), imgType, nameSuffix, outFlatten, pathRel, pathOut)
  const exists = await fileExists(target)
  const obs = await isObsMap(file, mapName)
  const skipExists = exists && imgSkip
  const skipObs = obs && obsSkip
  if (skipExists || skipObs) {
    logFeedback(outQuiet, fileRel, skipExists, skipObs)
    return
  }
  const [img, width, height] = await renderMapImageData(gfx, map, 32, file)
  const buffer = await encodeMapImage(imgType, img, width, height, imgSize)
  await ensureDir(path.dirname(target))
  await fs.writeFile(target, buffer, null)
  logFeedback(outQuiet, pathRel ? path.relative(pathRel, target) : target, false, false, {imgType, width, height, start, size: Buffer.byteLength(buffer)})
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
