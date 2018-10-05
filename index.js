"use strict"

// Imports.
const extenders = require("./src/extenders.js")
const parseString = require("./src/parseString.js")
const parseSync = require("./src/parseSync.js")
const Stream = require("./src/Stream.js")
const transforms = require("./src/transforms.js")

// Exports.
module.exports = {
  batch: transforms.batch,
  createObject: extenders.createObject,
  filter: transforms.filter,
  map: transforms.map,
  objectTransform: transforms.objectTransform,
  parseStream: transforms.parseStream,
  parseString: parseString,
  parseSync: parseSync,
  skip: transforms.skip,
  Stream: Stream
}
