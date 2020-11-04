// objectifier

"use strict"

// readObject :: [String] -> Options -> [String] -> Object String a
const readObject = (keys, options = {}) => (values) => {
  const { omitUndefined, reviver } = options
  var i, obj, value

  obj = {}
  for (i = 0; i < keys.length; i++) {
    value = readValue(values[i])
    if (typeof reviver === "function") value = reviver(value)
    if (value !== undefined || !omitUndefined) obj[keys[i]] = value
  }

  return obj
}

// readValue :: String -> a
const readValue = (s) => {
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
  readObject: readObject
}
