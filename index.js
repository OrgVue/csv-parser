"use strict"

// Imports.
const parser = require("./src/parser.js")
const extenders = require("./src/extenders.js")
const Stream = require("./src/Stream.js")

// Exports.
module.exports = {
  createObject: extenders.createObject,
  parseString: parser.parseString,
  Stream: Stream
}
