"use strict"

const assert = require("assert")
const parseString = require("../src/parseString.js")
const Stream = require("../src/Stream.js")

const parse = s => Stream.toArray(parseString(s))

describe("parser", function() {
  describe("#parseString", function() {
    it("should parse a string to stream", function() {
      assert.deepStrictEqual(parse('one, two\nhello"world,3.14'), [['one', ' two'], ['hello"world', '3.14']])
    })
  })
})
