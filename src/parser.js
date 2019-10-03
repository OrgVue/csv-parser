// csv-parser

"use strict"

// QUOTE :: String
const QUOTE = '"'

// recordDelim :: String
const recordDelim = "\n"

// valueDelim :: String
const valueDelim = ","

// data Parser = Parser {
//   buf :: String,
//   i :: Number,
//   multiline :: Bool,
//   quoting :: Bool,
//   recordDelim :: String,
//   row :: [String],
//   s :: String,
//   valid :: Bool,
//   valueDelim :: String
//  }

// create :: Options -> Parser
const create = o => ({
  buf: "",
  i: 0,
  multiline: o && (o.multiline === false) ? false : true,
  quoting: false,
  recordDelim: o && o.recordDelim ? o.recordDelim : recordDelim,
  row: [],
  s: "",
  valid: false,
  valueDelim: o && o.valueDelim ? o.valueDelim : valueDelim
})

// data :: String -> Parser -> ([String], Parser)
const data = (chunk, p) => {
  var buf, c, err, i, quoting, result, row, s, valid

  buf = p.buf
  i = p.i
  quoting = p.quoting
  row = p.row
  s = p.s + chunk
  valid = p.valid

  while (!result && i < s.length) {
    c = s.charAt(i++)

    if (!quoting) {
      if (c === p.valueDelim || c === p.recordDelim) {
        // end of value
        row.push(buf)
        valid = valid || buf.trim().length > 0
        buf = ""

        if (c === p.recordDelim) {
          // end of record
          if (valid) {
            result = row
            row = []
            valid = false
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
      if (c === p.recordDelim && !p.multiline) {
        result = undefined
        err = new Error('Multiline values not allowed')
        break
      }
      else if (c !== QUOTE) {
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

  return [
    result,
    {
      buf: buf,
      err: err,
      i: i > s.length / 2 ? 0 : i,
      multiline: p.multiline,
      quoting: quoting,
      recordDelim: p.recordDelim,
      row: row,
      s: i > s.length / 2 ? s.substr(i) : s,
      valid: valid,
      valueDelim: p.valueDelim
    }
  ]
}

// end :: Parser -> [[String]]
const end = p => {
  var r, rows, valid

  rows = []
  r = data("", p)

  while (r[0] !== undefined) {
    rows.push(r[0])
    r = data("", r[1])
  }

  p = r[1]
  valid = p.valid
  if (p.buf.length > 0) {
    p.row.push(p.buf)
    valid = valid || p.buf.trim().length > 0
  }

  if (valid) {
    rows.push(p.row)
  }

  return rows
}

// Exports.
module.exports = {
  create: create,
  data: data,
  end: end
}
