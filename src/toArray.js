// toArray

"use strict"

// Imports.
const { Writable } = require("stream")

// toArray :: Stream a -> Promise [a]
const toArray = stream => {
  const source = []

  const write = stream.pipe(
    new Writable({
      objectMode: true,
      write(chunk, encoding, callback) {
        source.push(chunk)
        callback()
      }
    })
  )

  return new Promise((resolve, reject) => {
    write.on("finish", () => {
      resolve(source)
    })
    write.on("error", reject)
  })
}

// Exports.
module.exports = toArray
