// StarCraft map preview generator
// © MIT license

/** Returns only unique itemse of an array. */
const arrayUniq = arr => [...new Set(arr)]

/** Wraps anything in an array if it isn't one already. */
const arrayWrap = obj => Array.isArray(obj) ? obj : [obj]

/** Checks whether something is a string. */
const isString = obj => typeof obj === 'string' || obj instanceof String

/** Pushes a stream to a buffer and then resolves when the stream completes. */
const streamToBuffer = stream => new Promise((resolve, reject) => {
  const buffer = []
  stream.on('data', chunk => buffer.push(chunk))
  stream.on('end', () => resolve(Buffer.concat(buffer)))
  stream.on('error', err => reject(err))
})

module.exports = {
  arrayUniq,
  arrayWrap,
  streamToBuffer,
  isString
}
