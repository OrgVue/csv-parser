// mixin

"use strict"

module.exports = src => tar => {
  var key

  for (key in src) {
    tar[key] = src[key]
  }

  return tar
}
