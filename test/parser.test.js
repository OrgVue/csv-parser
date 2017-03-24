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
  describe("#create", function() {
    it("should return batches", function() {
      var p, r

      p = parser.create(3)
      r = parser.data('1\n2\n3\n4\n5\n6\n7\n8\n9\n10\n', p)
      assert.deepStrictEqual(r[0], [['1'], ['2'], ['3']])

      r = parser.data("", r[1])
      assert.deepStrictEqual(r[0], [['4'], ['5'], ['6']])

      assert.deepStrictEqual(parser.end(r[1]), [['7'], ['8'], ['9'], ['10']])
    })
  })

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
    it("should handle chunk crossing values", function() {
      var p, r

      p = parser.create(1)
      r = parser.data('hello world, foo', p)
      assert.deepStrictEqual(r[0], [])

      r = parser.data('bar\none,two\n', r[1])
      assert.deepStrictEqual(r[0], [['hello world', ' foobar']])

      assert.deepStrictEqual(parser.end(r[1]), [['one', 'two']])
    })

    it("should handle chunk crossing records", function() {
      var p, r

      p = parser.create(1)
      r = parser.data('hello,world', p)
      assert.deepStrictEqual(r[0], [])

      r = parser.data('\none', r[1])
      assert.deepStrictEqual(r[0], [['hello', 'world']])

      assert.deepStrictEqual(parser.end(r[1]), [['one']])
    })
  })
})
