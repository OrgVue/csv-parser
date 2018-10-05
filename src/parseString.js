"use strict"

// Imports.
const parser = require("./parser.js")
const Stream = require("./Stream.js")

// data :: String -> Parser -> ([String], Parser)
const data = (chunk, p) => {
  var r

  if (!p) return [undefined, undefined]

  r = parser.data(chunk, p)

  return r[0] !== undefined ? r : [parser.end(r[1])[0], undefined]
}

// parseString :: String -> Options -> Stream [String]
const parseString = (s, o) =>
  Stream(
    data(s, parser.create(o)),
    state => (state[0] !== undefined ? state[0] : Stream.EOS),
    state => data("", state[1])
  )

// Exports.
module.exports = parseString
