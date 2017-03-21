"use strict"

// Imports.
const csvparser = require("./src/csv-parser.js")
const extenders = require("./src/transforms.js")

// Exports.
module.exports = {
  createObjects: extenders.createObjects,
  parseString: csvparser.parseString
}
