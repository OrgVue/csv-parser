// csv-parser

"use strict"

// Imports.
const Stream = require("./Stream.js")

// QUOTE :: String
const QUOTE = '"'

// recordDelim :: String
const recordDelim = "\n"

// valueDelim :: String
const valueDelim = ","

// data State = State {
//   i :: Number,
//   row :: [String] | Stream.EOS
//   s :: String
//  }

// getState :: Number -> String -> State
const getState = (i, s) => {
  var buf, c, quoting, row, valid

  buf = ""
  quoting = valid = false
  row = []
  while (i < s.length) {
    c = s.charAt(i++)
    if (quoting) {
      if (c === valueDelim || c === recordDelim) {
        quoting = false
        buf = (QUOTE + buf).trim()
        row.push(buf)
        valid = valid || buf.length > 0
        buf = ""

        if (c === recordDelim) {
          if (valid) {
            break
          } else {
            row = []
          }
        }
      } else if (c !== QUOTE) {
        buf = buf + c
      } else {
        if (i < s.length && s.charAt(i) === QUOTE) {
          // escaped quote
          buf = buf + c
          i++
        } else {
          // end of quote
          quoting = false
        }
      }
    } else {
      if (c === valueDelim) {
        buf = buf.trim()
        row.push(buf)
        valid = valid || buf.length > 0
        buf = ""
      } else if (c === recordDelim) {
        if (buf.length > 0) {
          buf = buf.trim()
          row.push(buf)
          valid = valid || buf.length > 0
          buf = ""
        }

        if (valid) {
          break
        } else {
          row = []
        }
      } else if (c === QUOTE && buf.length === 0) {
        // start of quote
        quoting = true
      } else {
        buf = buf + c
      }
    }
  }

  if (buf.length > 0) {
    if (quoting) buf = QUOTE + buf
    buf = buf.trim()
    row.push(buf)
    valid = valid || c.length > 0
    buf = ""
  }

  return {
    i: i,
    row: valid ? row : Stream.EOS,
    s: s
  }
}

// parseString :: String -> Stream [String]
const parseString = s => Stream(
  getState(0, s),
  state => state.row,
  state => getState(state.i, state.s)
)

// Exports.
module.exports = {
  parseString: parseString
}
