// csv-parser

"use strict"

// Imports.
const mixin = require("./mixin.js")

// QUOTE :: String
const QUOTE = '"'

// recordDelim :: String
const recordDelim = "\n"

// valueDelim :: String
const valueDelim = ","

// data Parser = Parser {
//   buf :: String,
//   i :: Number,
//   n :: Number,
//   quoting :: Bool
//   row :: [String]
//   rows :: [[String]] - note this is mutated
//   s :: String
//   valid :: Bool
//  }

// create :: Number -> Parser
const create = n => ({
  buf: "",
  i: 0,
  n: n,
  quoting: false,
  row: [],
  rows: [],
  s: "",
  valid: false
})

// data :: String -> Parser -> ([[String]], Parser)
const data = (chunk, p) => {
  var buf, c, i, quoting, row, s, valid

  buf = p.buf
  i = p.i
  quoting = p.quoting
  row = p.row
  s = p.s + chunk
  valid = p.valid

  while (i < s.length) {
    c = s.charAt(i++)

    if (!quoting) {
      if (c === valueDelim || c === recordDelim) { // end of value
        row.push(buf)
        valid = valid || buf.trim().length > 0
        buf = ""

        if (c === recordDelim) { // end of record
          if (valid) {
            p.rows.push(row)
            row = []
            valid = false
            if (p.rows.length >= p.n) break
          } else {
            row = []
          }
        }
      } else if (c === QUOTE && buf.length === 0) {
        // start of quote
        quoting = true
      } else {
        buf = buf + c
      }
    } else {
      if (c !== QUOTE) {
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
    }
  }

  return [p.rows.length >= p.n ? p.rows : [], {
    buf: buf,
    i: i,
    n: p.n,
    quoting: quoting,
    row: row,
    rows: p.rows.length >= p.n ? [] : p.rows,
    s: s,
    valid: valid
  }]
}

// end :: Parser -> [[String]]
const end = p => {
  var r, valid

  p = data("", mixin({ n: Number.MAX_VALUE })(p))[1] // force read all, but return nothing

  valid = p.valid
  if (p.buf.length > 0) {
    p.row.push(p.buf)
    valid = valid || p.buf.trim().length > 0
  }

  if (valid) {
    p.rows.push(p.row)
  }

  return p.rows
}

// Exports.
module.exports = {
  create: create,
  data: data,
  end: end
}
