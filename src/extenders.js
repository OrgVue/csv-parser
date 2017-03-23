// extenders

"use strict"

// Imports.
const Stream = require("./Stream.js")

// createObjects :: [String] -> Stream [String] -> Stream (Object String a)
const createObject = (keys, source) => Stream.extend(stream => {
  var i, obj, value, values

  values = Stream.extract(stream)
  if (values === Stream.EOS) return Stream.EOS

  obj = {}
  for (i = 0; i < keys.length; i++) {
    value = readValue(values[i])
    if (value !== undefined) obj[keys[i]] = value
  }

  return obj
}, source)

// readValue :: String -> a
const readValue = s => {
  // n :: Number, t :: String
  var n, t

  if (!s) return // test for truthy string

  t = s.trim().toLowerCase()
  if (!t) return

  if (t === "false") {
    return false
  } else if (t === "true") {
    return true
  }

  n = t ? Number(t) : NaN
  if (!isNaN(n)) return n

  return s.trim()
}

// Exports.
module.exports = {
  createObject: createObject
}
