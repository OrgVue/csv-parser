// Stream

"use strict"

// End Of Stream
const EOS = "__STREAM__EOS"

// data Stream a = Stream s (s -> a) (s -> s)
const Stream = (state, f, g) => [state, f, g]

// extend :: (Stream a -> b) -> Stream a -> Stream b
const extend = transform => stream => Stream(stream, transform, Stream.next)

// extract :: Stream a -> a
const extract = stream => stream[1](stream[0])

// next :: Stream a -> Stream a
const next = stream => Stream(stream[2](stream[0]), stream[1], stream[2])

// Exports.
Stream.EOS = EOS
Stream.extend = extend
Stream.extract = extract
Stream.next = next
module.exports = Stream
