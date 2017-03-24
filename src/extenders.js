// extenders

"use strict"

// Imports.
const objectifier = require("./objectifier.js")
const Stream = require("./Stream.js")

// createObjects :: [String] -> Stream [String] -> Stream (Object String a)
const createObject = (keys, source) => Stream.extend(stream => {
  var values

  values = Stream.extract(stream)

  return values !== Stream.EOS ? objectifier.readObject(keys)(values) : Stream.EOS
}, source)

// Exports.
module.exports = {
  createObject: createObject
}
