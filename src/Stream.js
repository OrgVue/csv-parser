// Stream

"use strict"

// Imports.
const mixin = require("./mixin.js")

// End Of Stream
const EOS = "__STREAM__EOS"

// data Stream a = Stream s (s -> a) (s -> s)
const Stream = (state, f, g) => [state, f, g]

// extend :: (Stream a -> b) -> Stream a -> Stream b
const extend = (transform, stream) => Stream(stream, transform, Stream.next)

// extract :: Stream a -> a
const extract = stream => stream[1](stream[0])

// fromArray :: [a] -> Stream a
const fromArray = xs => Stream(
  [0, xs],
  s => s[0] < s[1].length ? s[1][s[0]] : EOS,
  s => [s[0] + 1, s[1]]
)

// next :: Stream a -> Stream a
const next = stream => Stream(stream[2](stream[0]), stream[1], stream[2])

// Exports.
module.exports = mixin({
  EOS: EOS,
  extend: extend,
  extract: extract,
  fromArray: fromArray,
  next: next
})(Stream)
