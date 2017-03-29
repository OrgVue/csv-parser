"use strict"

// Imports.
const extenders = require("./src/extenders.js")
const parseString = require("./src/parseString.js")
const Stream = require("./src/Stream.js")
const transforms = require("./src/transforms.js")

// Exports.
module.exports = {
  batch: transforms.batch,
  createObject: extenders.createObject,
  objectTransform: transforms.objectTransform,
  parseStream: transforms.parseStream,
  parseString: parseString,
  Stream: Stream
}
