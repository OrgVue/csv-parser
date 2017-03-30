# csv-parser

A streaming parser for the CSV format.

## Using node streams

```javascript
"use strict"

const fs = require("fs")
const parser = require("csv-parser")

const read = fs.createReadStream("./Big.csv", "utf-8").
  pipe(parser.parseStream()).
  pipe(parser.objectTransform({ trimHeader: true })).
  pipe(parser.batch(25000))
  
read.on("data", data => {
  // data contains an array of 25000 objects, or fewer for the very last chunk
})
read.on("end", () => console.log("END"))
read.read()
```

## API
### batch
```haskell
batch :: Number -> Transform a [a]
```
Batch transforms a stream of items into a stream of batches, with the batch size given as a number of items.

### filter
```haskell
filter :: (a -> Bool) -> Transforms a a
```
Given a predicate, filter a stream of items.

### map
```haskell
map :: (a -> b) -> Transforms a b
```
Given a mapping function, transform a stream of a's to a stream of b's.

### objectTransform
```haskell
objectTransform :: Options -> Transform [String] Object
```
Transform a stream of values to a stream of objects, either by specifying a header or using the first value as the header.

### parseStream
```haskell
parseStream :: () -> Transform String [String]
```
Parse a character stream as CSV, resulting in a stream of values.

## Todo
- Remove memory method
- Check excel behaviour, allow setting value delimiter to tab to allow reading pastes

## Using pure streams from in memory string

The parser will return a stream of arrays. Each array represents a line in the CSV and each string in the array represents a value.

```javascript
const parser = require("csv-parser")
const Stream = parser.Stream

var stream, row

stream = parser.parseString("one, two\nHello world,3.14")

while ((row = Stream.extract(stream)) !== Stream.EOS) {
  console.log(row)
  stream = Stream.next(stream)
}

// The following will be logged to the console
// ["one", "two"]
// ["Hello world", "3.14"]
```

## Extending the pure stream to objects

With an extender we can return a stream of object, where the values are read as booleans, numbers or strings.

```javascript
const parser = require("csv-parser")
const Stream = parser.Stream

var header, stream, obj

stream = parser.parseString("one, two\nHello world,3.14")

header = Stream.extract(stream)
if (header === Stream.EOS) throw new Error("CSV is empty")
stream = Stream.next(stream)
stream = parser.createObject(header.map(key => key.trim()), stream)

while ((obj = Stream.extract(stream)) !== Stream.EOS) {
  console.log(obj)
  stream = Stream.next(stream)
}

// The following will be logged to the console
// { one: "Hello world", two: 3.14 }
```
