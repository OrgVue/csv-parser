"use strict"

const assert = require("assert")
const parser = require("../src/parser.js")

// parse :: String -> [[String]]
const parse = s => {
  var r, rows

  r = parser.data(s, parser.create())
  rows = r[0] !== undefined ? [r[0]] : []

  return rows.concat(parser.end(r[1]))
}

describe("parser", function() {
  describe("#create", function() {
    it("should return one by one", function() {
      var p, r

      p = parser.create()
      r = parser.data('1\n2\n3', p)
      assert.deepStrictEqual(r[0], ['1'])

      r = parser.data("", r[1])
      assert.deepStrictEqual(r[0], ['2'])

      r = parser.data("", r[1])
      assert.deepStrictEqual(r[0], undefined)

      assert.deepStrictEqual(parser.end(r[1]), [['3']])
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

      p = parser.create()
      r = parser.data('hello world, foo', p)
      assert.strictEqual(r[0], undefined)

      r = parser.data('bar\none,two\n', r[1])
      assert.deepStrictEqual(r[0], ['hello world', ' foobar'])

      assert.deepStrictEqual(parser.end(r[1]), [['one', 'two']])
    })

    it("should handle chunk crossing records", function() {
      var p, r

      p = parser.create()
      r = parser.data('hello,world', p)
      assert.deepStrictEqual(r[0], undefined)

      r = parser.data('\none', r[1])
      assert.deepStrictEqual(r[0], ['hello', 'world'])

      assert.deepStrictEqual(parser.end(r[1]), [['one']])
    })
  })
})
