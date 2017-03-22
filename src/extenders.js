// extenders

"use strict"

// Imports.
const Stream = require("./Stream.js")

// createObjects :: [String] -> Stream [String] -> Stream (Object String a)
const createObject = (keys, source) => Stream.extend(stream => {
  var i, obj, values

  values = Stream.extract(stream)
  if (values === Stream.EOS) return Stream.EOS

  obj = {}
  for (i = 0; i < keys.length; i++) {
    if (values[i]) {
      obj[keys[i]] = readValue(values[i])
    }
  }

  return obj
}, source)

// readValue :: String -> a
const readValue = s => {
  var n, t

  t = s.toLowerCase()
  if (t === "false") {
    return false
  } else if (t === "true") {
    return true
  }

  n = Number(t)
  if (!isNaN(n)) return n

  return s
}

// Exports.
module.exports = {
  createObject: createObject
}
