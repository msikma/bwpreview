#!/usr/bin/env node

// StarCraft map preview generator
// © MIT license

const path = require('path')
const process = require('process')
const os = require('os')
const {ArgumentParser} = require('argparse')
const {readJSON} = require('../lib/util')
const {generationPresets, generationExts} = require('../lib/presets')

const pkgData = readJSON(`${__dirname}/../package.json`)
const parser = new ArgumentParser({
  description: `${pkgData.description}.`,
  add_help: true
})
parser.add_argument('FILE', {help: 'StarCraft map files (.scm, .scx) to generate images for', nargs: '*'})
parser.add_argument('-v', '--version', {action: 'version', version: pkgData.version})
parser.add_argument('-d', '--dir', {help: 'directory containing StarCraft map files to process', dest: 'dir', default: null, metavar: 'PATH', nargs: '+'})
parser.add_argument('-m', '--map-name', {help: 'use map name, not filename, to determine output filename', dest: 'useInternalName', action: 'store_true'})
parser.add_argument('-f', '--flatten', {help: 'flatten output directory structure', dest: 'outFlatten', action: 'store_true'})
parser.add_argument('-q', '--quiet', {help: 'no output except for errors', dest: 'outQuiet', action: 'store_true'})
parser.add_argument('--preset', {help: `generation preset to use (${Object.keys(generationPresets).map(ext => `"${ext}"`).join(', ')}); sets --suffix, --type, --size`, dest: 'preset', metavar: 'NAME', default: null, choices: Object.keys(generationPresets)})
parser.add_argument('--suffix', {help: 'suffix string to include in the image filename', dest: 'nameSuffix', metavar: 'STR', default: null})
parser.add_argument('--type', {help: `type of image to generate (${generationExts.map(ext => `"${ext}"`).join(', ')})`, dest: 'imgType', metavar: 'TYPE', default: 'png', choices: generationExts})
parser.add_argument('--size', {help: 'size in which to fit the image (e.g. 500 to make up to a 500x500 image)', dest: 'imgSize', metavar: 'PX', default: null})
parser.add_argument('--skip-existing', {help: 'skip generation when an image of the expected name already exists', dest: 'imgSkip', action: 'store_true'})
parser.add_argument('--skip-obs', {help: 'skip generation of observer maps (with "(Ob)" in the name)', dest: 'obsSkip', action: 'store_true'})
parser.add_argument('--rel-path', {help: 'path from which to calculate relative paths (for use with -d)', dest: 'pathRel', metavar: 'PATH', default: process.cwd()})
parser.add_argument('--out-path', {help: 'path to save image files to (if unspecified, same as map file)', dest: 'pathOut', metavar: 'PATH', default: null})
parser.add_argument('--gfx-path', {help: 'path where the StarCraft graphics files can be found', dest: 'pathGfx', metavar: 'PATH', default: path.join(os.homedir(), '.config', 'bwpreview')})

const args = {...parser.parse_args()}

const {main} = require('./main.js')
const runMain = async () => {
  try {
    await main(args, {cwd: process.cwd()})
  }
  catch (err) {
    console.error(`bwpreview: ${err.toString()}`)
    console.error(err)
    process.exitCode = 1
  }
}

runMain()
