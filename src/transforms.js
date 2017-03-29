// transforms

"use strict"

// Imports.
const objectifier = require("./objectifier.js")
const parser = require("./parser.js")
const stream = require("stream")

// batch :: Number -> Transform Object [Object]
const batch = n => {
  var buf

  buf = []
  return new stream.Transform({
    flush: function(callback) {
      if (buf.length > 0) {
        this.push(buf)
        buf = []
      }

      callback()
    },
    objectMode: true,
    transform: function(chunk, encoding, callback) {
      buf.push(chunk)
      if (buf.length >= n) {
        this.push(buf)
        buf = []
      }

      callback()
    }
  })
}

// objectTransform :: Options -> Transform [String] Object
const objectTransform = options => {
  var f, keys

  return new stream.Transform({
    flush: function(callback) {
      callback()
    },
    objectMode: true,
    transform: function(chunk, encoding, callback) {
      if (!keys) {
        keys = chunk
        if (options && options.trimHeader) keys = keys.map(key => key.trim())
        f = objectifier.readObject(keys)
      } else {
        this.push(f(chunk))
      }

      callback()
    }
  })
}

// parseStream :: () -> Transform String [String]
const parseStream = () => {
  var p

  p = parser.create()

  return new stream.Transform({
    flush: function(callback) {
      var i, r

      r = parser.end(p)
      for (i = 0; i < r.length; i++) this.push(r[i])

      p = undefined
      callback()
    },
    objectMode: true,
    transform: function(chunk, encoding, callback) {
      var r

      r = parser.data(String(chunk), p)
      while (r[0] !== undefined) {
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
  batch: batch,
  objectTransform: objectTransform,
  parseStream: parseStream
}
