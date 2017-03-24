"use strict"

// Imports.
const parser = require("./parser.js")
const Stream = require("./Stream.js")

// data :: String -> Parser -> ([[String]], Parser)
const data = (chunk, p) => {
  var r

  if (!p) return [[], undefined]

  r = parser.data(chunk, p)

  return r[0].length > 0 ? r : [parser.end(r[1], undefined)]
}

// parseString :: String -> Stream [String]
const parseString = s => Stream(
  data(s, parser.create(1)),
  state => state[0].length > 0 ? state[0][0] : Stream.EOS,
  state => data("", state[1])
)

// Exports.
module.exports = parseString
