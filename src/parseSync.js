// parseSync

"use strict"

// Imports.
const parseString = require("./parseString.js")
const { readObject } = require("./objectifier.js")
const Stream = require("./Stream.js")

// parseSync :: String -> Options -> [Object]
const parseSync = (s, o = {}) => {
  let reader,
    x,
    xs = []

  let stream = parseString(s, {
    recordDelim: o.recordDelim,
    valueDelim: o.valueDelim
  })

  while ((x = Stream.extract(stream)) !== Stream.EOS) {
    if (!reader) {
      if (o.trimHeader) {
        x = x.map(key => key.trim())
      }
      if (o.array === true) {
        reader = a => a
        xs.push(x)
      } else {
        reader = readObject(x, o.reviver)
      }
    } else xs.push(reader(x))
    stream = Stream.next(stream)
  }

  return xs
}

// Exports.
module.exports = parseSync
