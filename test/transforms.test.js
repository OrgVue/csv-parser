"use strict"

const assert = require("assert")
const stream = require("stream")
const transforms = require("../src/transforms.js")

describe("transforms", function() {
  describe("#batch", function() {
    it("should batch a stream", function(done) {
      var r, s

      s = new stream.Readable({
        objectMode: true,
        read: function(size) {
          this.push(1)
          this.push(2)
          this.push(3)
          this.push(4)
          this.push(5)
          this.push(6)
          this.push(7)
          this.push(8)
          this.push(null)
        }
      }).pipe(transforms.batch(3))

      r = []
      s.on("data", buf => r.push(buf))
      s.on("end", () => {
        assert.deepStrictEqual(r, [[1, 2, 3], [4, 5, 6], [7, 8]])
        done()
      })
      s.read()
    })
  })

  describe("#parseStream", function() {
    it("should parse a stream", function(done) {
      var r, s

      s = stringStream("one, two\nhello,world")
      s = s.pipe(transforms.parseStream())

      r = []
      s.on("data", row => r.push(row))
      s.on("end", () => {
        assert.deepStrictEqual(r, [["one", " two"], ["hello", "world"]])
        done()
      })
      s.read()
    })
  })

  describe("#objectTransform", function() {
    it("should transform to objects", function(done) {
      var r, s

      s = new stream.Readable({
        objectMode: true,
        read: function(size) {
          this.push(["one", " two"])
          this.push(["hello", " true  "])
          this.push(["3.14"])
          this.push(null)
        }
      }).pipe(transforms.objectTransform({ trimHeader: true }))

      r = []
      s.on("data", obj => r.push(obj))
      s.on("end", () => {
        assert.deepStrictEqual(r, [
          { one: "hello", two: true },
          { one: 3.14, two: undefined }
        ])
        done()
      })
      s.read()
    })
  })
})

function stringStream(s) {
  return new stream.Readable({
    encoding: "utf-8",
    read: function(size) {
      this.push(s)
      this.push(null)
    }
  })
}
