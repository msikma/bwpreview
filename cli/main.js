// StarCraft map preview generator
// © MIT license

const path = require('path')
const pick = require('lodash.pick')
const {generateMapPreview, loadGraphics} = require('../lib/map')
const {generationPresets} = require('../lib/presets')
const {arrayUniq, findMapsInDir, fileIsReadable} = require('../lib/util')

/**
 * Checks and unpacks arguments passed on the command line and returns a sanitized object.
 */
async function unpackArgs(args) {
  if (args.preset) {
    // Override the passed suffix, type and size arguments.
    const preset = generationPresets[args.preset]
    if (!preset) throw new Error(`preset "${args.preset}" does not exist`)
    Object.assign(args, preset)
  }

  // Ensure that imgSize is either a number or null.
  args.imgSize = args.imgSize == null ? null : Number(args.imgSize)

  if (!args.pathGfx || !await fileIsReadable(args.pathGfx)) {
    throw new Error(`could not access StarCraft graphics files on the given path: ${args.pathGfx}`)
  }
  if (args.pathRel) {
    args.pathRel = path.resolve(args.pathRel)
  }

  return pick(args, ['imgSkip', 'imgType', 'imgSize', 'useInternalName', 'nameSuffix', 'outQuiet', 'outFlatten', 'pathGfx', 'pathOut', 'pathRel'])
}

/**
 * Command-line entry point.
 * 
 * This checks the arguments and then runs generateMapPreviews() for all given files.
 */
async function main(args) {
  // Find all .scm and .scx files in given -d directories,
  // and collect all file paths passed directly.
  const files = [...args.FILE, ...await findMapsInDir(args.dir, args.pathRel)]
    .map(filepath => path.resolve(filepath))
  
  // Generate map previews for all unique file paths.
  return generateMapPreviews(arrayUniq(files), await unpackArgs(args))
}

/**
 * Generates map previews for all given map files.
 * 
 * This loads up the StarCraft graphics and then iterates over every passed file,
 * producing an image with the given options.
 */
async function generateMapPreviews(files, options = {}) {
  const gfx = loadGraphics(options.pathGfx)
  for (const file of files) {
    await generateMapPreview(file, gfx, options)
  }
}

module.exports = {
  main
}
