// © 2014 QUILLU INC.
// BitString utils
// Bitstring is a string representation of binary number little endian
// eg '01', '101010', 1010101010101011'
'use strict';

/* global window */

var TEST = /^[01]+$/;

/**
 * @private
 * Get n randombytes using nodejs crypto, window.crypto, or math.random in order
 * @param  {integer} n The number of bytes to get
 * @return {Array.<integer>}   An array of n random bytes
 */
function _randomBytes (n) {

  // Nodejs
  // randomBytes might except if not enough entropy
  try {
    var crypto = require('crypto');
    return crypto.randomBytes(n);
  } catch(e) {}

  var result;
  // Modern Browsers
  if (window !=null && window.crypto != null) {
    result = new Uint8Array(n);
    window.crypto.getgetRandomValues(result);
  } else {
    // Backup! Not cryptographically secure
    result = new Array(n);
    for(var i = 0; i < n; i++){
      result[i] = Math.floor(Math.random() * 256);
    }
  }
  return result;
}

/**
 * Pad a string to atleast desired width
 * @param  {string} n      String to pad
 * @param  {integer} width Width to pad to
 * @param  {char=} z       Optional pad char, defaults to '0'
 * @return {string}        Padded string
 */
function pad (n, width, z) {
  if (typeof n !== 'string') throw new Error('bitString#pad: Need String');
  z = z || '0';
  while(n.length < width) {
    n = z + n;
  }
  return n;
}

/**
 * Check if bitstring is valud
 * @param  {string}  bits The bitstring to test
 * @return {Boolean}      True iff bitstring is valid
 */
function isValid (bits){
  return TEST.test(bits);
}

/**
 * Fletcher's checksum on a bitstring
 * @param  {string} bits Bitstring to checksum
 * @param  {integer} size Size of checksum, must be divisible by 2
 * @return {string}      Return checksum as bitstring. With BA, ie sumA last;
 */
function checksum (bits, size) {
  if (bits == null || !isValid(bits)) throw new Error('bitString#checksum: Need valid bits');
  if (size == null || size % 2 !== 0) throw new Error('bitString#checksum: size needs to be even');

  var sumA = 0,
      sumB = 0,
      i;

  for (i = 0; i < bits.length; i++) {
    sumA = (sumA + parseInt(bits[i], 2)) % size;
    sumB = (sumB + sumA) % size;
  }

  return pad(sumB.toString(2), size / 2) + pad(sumA.toString(2), size / 2);
}

// Get n random bits
/**
 * Get N randomBits as bitstring
 * @param  {integer} n Number of random bits to get
 * @return {string}   The random bitstring 
 */
function randomBits (n) {
  if (typeof n !== 'number') throw new Error('bitString#randomBits: Need number');
  var buf = _randomBytes(Math.ceil(n/8)),
      bits = '';
  for (var i = 0; i < n; i++) {
    bits += (buf[Math.floor(i / 8)] & (0x01 << (i % 8))) ? '1' : '0';
  }
  return bits;
}

// Public
module.exports.pad         = pad;
module.exports.isValid     = isValid;
module.exports.checksum    = checksum;
module.exports.randomBits  = randomBits;
