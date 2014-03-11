// © 2014 QUILLU INC.
// Random
'use strict';

// Random URL encoded ID.
// Each char is 6bits long, (2^6) = 64 bits of entropy
//
// Probability collision
// p(n;d) = 1 - exp(-n(n-1)/(2*d))
// 12 chars(72bits): p(2^72; e10 rows) = 1.1e-4
// 16 chars(96bits): = p(2^96; e10 rows) = 6.31e-12
// 24 chars(144bits): = p(2^144; e10 rows) = 2.2e-26
// 32 chars(192bits): = p(2^144; e10 rows) = 8.0e-41
// uuid: 32hex chars (and 4 dashes),(4bits version, 2 bits varient) 122bits: 9.40e-18
// so at 16char, passy is 4e9 x more likely of collision than uuid
// but at less than half length. Use more chars if required,
// but even with a 1Tn items, 16chars has a 6e-6 of a collision, or
// in other words you would need 332 Tn items before you likely see a collision (p=0.5)

var bitString = require('./bitString'),
    baseURL   = require('./baseURL'),
    DEFAULT   = 16; // 16 * 6 = 96 bits

/**
 * Generate a baseURL random id
 * @param {number} length The number of chars in id
 * @return {string} The id
 */
function random (length) {
  // Guard
  if (length == null) {
    length = DEFAULT;
  } else if (!(typeof length === 'number' && length > 0)) {
    throw new Error('Length should be +ve Number');
  }

  // Fill buffer
  var bits = bitString.randomBits(6 * length);
  return baseURL.encode(bits);
}

/**
 * Verify a random id
 * @param {string} id The id to verify
 * @return {boolen} True iff valid
 */
function isValid (id) {
  return baseURL.isValid(id);
}

/**
 * Convert a random id to Integer Array
 * @param {string} id The id to convert.
 * @return {Array.<number>} result
 */
function toArray (id) {
  if (!isValid(id)) throw new Error('random#toArray: Need valid id');
  // Decode
  var result = [];
  for (var i = 0; i < id.length; i++) {
    result.push(baseURL.ALPHABET.indexOf(id[i]));
  }
  return result;
}

// Public
module.exports = random;
module.exports.isValid = isValid;
module.exports.toArray = toArray;
module.exports.DEFAULT = DEFAULT;