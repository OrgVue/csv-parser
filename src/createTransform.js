// createTransform

"use strict"

// Imports.
const parser = require("./parser.js")
const stream = require("stream")

// createTransform :: Number -> Transform
const createTransform = n => {
  var p

  p = parser.create(n)

  return new stream.Transform({
    flush: function(callback) {
      var r

      r = parser.end(p)
      if (r.length > 0) this.push(r)
      p = undefined
      callback()
    },
    objectMode: true,
    transform: function(chunk, encoding, callback) {
      var r

      r = parser.data(String(chunk), p)
      while (r[0].length > 0) {
        this.push(r[0])
        r = parser.data("", r[1])
      }

      p = r[1]
      callback()
    }
  })
}

// Exports.
module.exports = createTransform
