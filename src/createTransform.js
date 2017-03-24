// createTransform

"use strict"

// Imports.
const stream = require("stream")

// createTransform :: () -> Transform
const createTransform = () => {
  return new stream.Transform({
    flush: () => console.log("FLUSH"),
    transform: (chunk, encoding, callback) => {
      callback(null, String(chunk).toLowerCase())
    }
  })
}

// Exports.
module.exports = createTransform
