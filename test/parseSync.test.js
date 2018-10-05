"use strict"

const assert = require("assert")
const parseSync = require("../src/parseSync.js")

describe("parser", function() {
  describe("#parseSync", function() {
    it("should synchronously parse a string to objects", function() {
      assert.deepStrictEqual(
        parseSync('one, two\nhello"world,3.14', { trimHeader: true }),
        [{ one: 'hello"world', two: 3.14 }]
      )
    })
  })
})
