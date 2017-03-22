"use strict"

// Imports.
const parser = require("./src/parser.js")
const extenders = require("./src/extenders.js")

// Exports.
module.exports = {
  createObject: extenders.createObject,
  parseString: parser.parseString
}
