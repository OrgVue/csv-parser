// transforms

"use strict"

// Imports.
const objectifier = require("./objectifier.js")
const parser = require("./parser.js")
const stream = require("stream")

// batch :: Number -> Transform a [a]
const batch = (n) => {
  var buf

  buf = []
  return new stream.Transform({
    flush: function (callback) {
      if (buf.length > 0) {
        this.push(buf)
        buf = []
      }

      callback()
    },
    objectMode: true,
    transform: function (chunk, encoding, callback) {
      buf.push(chunk)
      if (buf.length >= n) {
        this.push(buf)
        buf = []
      }

      callback()
    }
  })
}

// filter :: (a -> Bool) -> Transform a a
const filter = (f) => {
  return new stream.Transform({
    flush: function (callback) {
      callback()
    },
    objectMode: true,
    transform: function (chunk, encoding, callback) {
      if (f(chunk)) {
        this.push(chunk)
      }

      callback()
    }
  })
}

// map :: (a -> b) -> Transform a b
const map = (m) => {
  return new stream.Transform({
    flush: function (callback) {
      callback()
    },
    objectMode: true,
    transform: function (chunk, encoding, callback) {
      this.push(m(chunk))

      callback()
    }
  })
}

// objectTransform :: Options -> Transform [String] Object
const objectTransform = (options = {}) => {
  const { omitUndefined, reviver, trimHeader } = options
  var f, keys

  return new stream.Transform({
    flush: function (callback) {
      callback()
    },
    objectMode: true,
    transform: function (chunk, encoding, callback) {
      if (!keys) {
        keys = chunk
        if (trimHeader) keys = keys.map((key) => key.trim())
        f = objectifier.readObject(keys, { omitUndefined, reviver })
      } else {
        this.push(f(chunk))
      }

      callback()
    }
  })
}

// parseStream :: Options -> Transform String [String]
const parseStream = (o) => {
  var p

  p = parser.create(o)

  return new stream.Transform({
    flush: function (callback) {
      var i, r

      r = parser.end(p)
      for (i = 0; i < r.length; i++) this.push(r[i])

      p = undefined
      callback()
    },
    objectMode: true,
    transform: function (chunk, encoding, callback) {
      var r

      r = parser.data(String(chunk), p)
      while (r[0] !== undefined) {
        this.push(r[0])
        r = parser.data("", r[1])
      }

      p = r[1]
      callback(p.err) // undefined or parser Error
    }
  })
}

// skip :: Number -> Transform a a
const skip = (n) => {
  var i = 0

  return new stream.Transform({
    flush: function (callback) {
      callback()
    },
    objectMode: true,
    transform: function (chunk, encoding, callback) {
      if (i < n) {
        i += 1
      } else {
        this.push(chunk)
      }

      callback()
    }
  })
}

// Exports.
module.exports = {
  batch: batch,
  filter: filter,
  map: map,
  objectTransform: objectTransform,
  parseStream: parseStream,
  skip: skip
}
