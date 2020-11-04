// extenders

"use strict"

// Imports.
const objectifier = require("./objectifier.js")
const Stream = require("./Stream.js")

// createObjects :: [String] -> Stream [String] -> Options -> Stream (Object String a)
const createObject = (keys, source, options = {}) =>
  Stream.extend((stream) => {
    var values

    values = Stream.extract(stream)

    return values !== Stream.EOS
      ? objectifier.readObject(keys, options)(values)
      : Stream.EOS
  }, source)

// Exports.
module.exports = {
  createObject: createObject
}
