"use strict"

// Imports.
const createTransform = require("./src/createTransform.js")
const parseString = require("./src/parseString.js")
const extenders = require("./src/extenders.js")
const Stream = require("./src/Stream.js")

// Exports.
module.exports = {
  createObject: extenders.createObject,
  parseString: parseString,
  createTransform: createTransform,
  Stream: Stream
}
