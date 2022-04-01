// StarCraft map preview generator
// © MIT license

const fs = require('fs')

/**
 * Reads a JSON file synchronously and returns the results as a parsed object.
 */
const readJSON = filepath => {
  const content = fs.readFileSync(filepath, 'utf8')
  return JSON.parse(content)
}

module.exports = {
  readJSON
}
