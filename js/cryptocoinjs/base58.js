(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.base58 = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var basex = require('base-x')
var ALPHABET = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'

module.exports = basex(ALPHABET)

},{"base-x":2}],2:[function(require,module,exports){
// base* encoding
// Credits to https://github.com/cryptocoinjs/bs58

module.exports = function base (ALPHABET) {
  var ALPHABET_MAP = {}
  var BASE = ALPHABET.length
  var LEADER = ALPHABET.charAt(0)

  // pre-compute lookup table
  for (var i = 0; i < ALPHABET.length; i++) {
    ALPHABET_MAP[ALPHABET.charAt(i)] = i
  }

  function encode (buffer) {
    if (buffer.length === 0) return ''

    var i, j
    var digits = [0]

    for (i = 0; i < buffer.length; i++) {
      for (j = 0; j < digits.length; j++) digits[j] <<= 8

      digits[0] += buffer[i]

      var carry = 0
      for (j = 0; j < digits.length; ++j) {
        digits[j] += carry

        carry = (digits[j] / BASE) | 0
        digits[j] %= BASE
      }

      while (carry) {
        digits.push(carry % BASE)

        carry = (carry / BASE) | 0
      }
    }

    // deal with leading zeros
    for (i = 0; buffer[i] === 0 && i < buffer.length - 1; i++) {
      digits.push(0)
    }

    return digits.reverse().map(function (digit) {
      return ALPHABET[digit]
    }).join('')
  }

  function decode (string) {
    if (string.length === 0) return []

    var i, j
    var bytes = [0]

    for (i = 0; i < string.length; i++) {
      var c = string[i]
      if (!(c in ALPHABET_MAP)) throw new Error('Non-base' + BASE + ' character')

      for (j = 0; j < bytes.length; j++) bytes[j] *= BASE
      bytes[0] += ALPHABET_MAP[c]

      var carry = 0
      for (j = 0; j < bytes.length; ++j) {
        bytes[j] += carry

        carry = bytes[j] >> 8
        bytes[j] &= 0xff
      }

      while (carry) {
        bytes.push(carry & 0xff)

        carry >>= 8
      }
    }

    // deal with leading zeros
    for (i = 0; string[i] === LEADER && i < string.length - 1; i++) {
      bytes.push(0)
    }

    return bytes.reverse()
  }

  return {
    encode: encode,
    decode: decode
  }
}

},{}]},{},[1])(1)
});