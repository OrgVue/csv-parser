"use strict"

const assert = require("assert")
const parser = require("../src/parser.js")

// parse :: String -> [[String]]
const parse = s => {
  var r

  r = parser.data(s, parser.create(10))

  return r[0].concat(parser.end(r[1]))
}

describe("parser", function() {
  describe("#data", function() {
    it("should handle a single unmatched quote", function() {
      assert.deepStrictEqual(parse('"hello world,3.14\n'), [['hello world,3.14\n']])

      assert.deepStrictEqual(parse('he"llo world,3.14'), [['he"llo world', '3.14']])
    })

    it("should handle quoted strings", function() {
      assert.deepStrictEqual(parse('"Hello, world", 3.14'), [['Hello, world', ' 3.14']])
      assert.deepStrictEqual(parse('"Hello\nworld", 3.14'), [['Hello\nworld', ' 3.14']])
    })

    it("should handle quotes strings with trailing characters", function() {
      assert.deepStrictEqual(parse('"Hello, earth" II, 3.14'), [['Hello, earth II', ' 3.14']])
    })

    it("should not trim spaces", function() {
      assert.deepStrictEqual(parse('  space \n'), [['  space ']])
    })

    it("should ignore empty rows", function() {
      assert.deepStrictEqual(parse('a,b\n , \nc,d\n , \n'), [['a', 'b'], ['c', 'd']])
    })
  })

  describe("#end", function() {
    
  })
})
