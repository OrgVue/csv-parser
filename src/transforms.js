// transforms

"use strict"

// Imports.
const objectifier = require("./objectifier.js")
const parser = require("./parser.js")
const stream = require("stream")

// objectTransform :: () -> Transform
const objectTransform = () => {
  var keys

  return new stream.Transform({
    flush: function(callback) {
      callback()
    },
    objectMode: true,
    transform: function(chunk, encoding, callback) {
      var objects, rows

      if (!keys && chunk.length > 0) {
        keys = chunk[0]
        rows = chunk.slice(1)
      } else {
        rows = chunk
      }

      objects = rows.map(objectifier.readObject(keys))
      if (objects.length > 0) this.push(objects)

      callback()
    }
  })
}

// parseStream :: Number -> Transform
const parseStream = n => {
  var p

  p = parser.create(n + 1, n)

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
module.exports = {
  objectTransform: objectTransform,
  parseStream: parseStream
}
