"use strict"

const assert = require("assert")
const extenders = require("../src/extenders.js")
const Stream = require("../src/Stream.js")

describe("extenders", function() {
  describe("#createObect", function() {
    it("should turn cells into objects", function() {
      var stream

      stream = Stream.fromArray([["true", "3.14"], ["hello", ""]])
      stream = extenders.createObject(["one", "two"], stream)

      assert.deepEqual(Stream.extract(stream), { one: true, two: 3.14 })
      stream = Stream.next(stream)
      assert.deepEqual(Stream.extract(stream), { one: "hello" })
    })
  })
})
