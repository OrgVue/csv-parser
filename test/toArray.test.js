"use strict"

const toArray = require("../src/toArray.js")
const assert = require("assert")
const { Readable } = require("stream")

describe("parser", function() {
  describe("#toArray", function() {
    it("should convert an Object stream into a Promise of an Array", function(done) {
      const readable = new Readable({ objectMode: true })
      const input = [{ id: 1, name: "Alice" }, { id: 2, name: "Bob" }]

      input.forEach(o => readable.push(o))
      readable.push(null)

      toArray(readable).then(output => {
        assert.deepStrictEqual(output, input)
        done()
      })
    })
  })
})
