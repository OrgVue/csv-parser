"use strict"

const assert = require("assert")
const parser = require("../src/parser.js")
const Stream = require("../src/Stream.js")

describe("parser", function() {
  describe("#parseString", function() {
    it("should parse a string", function() {
      var stream

      stream = parser.parseString('One, Two\n,\n   Hello,World')

      assert.deepEqual(Stream.extract(stream), ["One", "Two"])
      stream = Stream.next(stream)
      assert.deepEqual(Stream.extract(stream), ["Hello", "World"])
    })
  })
})
