// © 2014 QUILLU INC.
// BaseURL codec
'use strict';

// Valid URL chars. 4x hex density
// See http://en.wikipedia.org/wiki/Base64#RFC_4648
// "$+.!*'()," also URL valid but not necessary or ideal
// In order of increasing ASCII values,
// so that resultant string has natural ordering
// (ie < work, DB's can create efficient indexes)
// - = 0, z= 63
// -_ mean usernames can be efficiently encoded

var bitString = require('./bitString'),
    ALPHABET  = ('-0123456789ABCDE' +
                 'FGHIJKLMNOPQRSTU' +
                 'VWXYZ_abcdefghij' +
                 'klmnopqrstuvwxyz').split(''),
    TEST = /^[_\-0-9-A-Za-z]+$/;

/**
 * Get baseURL char from given 6bit bitstring
 * @param  {string} bits  6bit bitstring
 * @return {string}       baseURL char
 */
function getChar (bits) {
  var index = parseInt(bits,2);
  if (isNaN(index) || index < 0 || index > 63) throw new Error('baseURL#getChar: Need valid bitString');
  return ALPHABET[index];
}

/**
 * Get 6bit bitstring given a baseURL char
 * @param  {string} char Single baseURL char
 * @return {string}      6bit bitstring of 'indexof' (0-63)
 */
function indexOfBits (char) {
  var index = ALPHABET.indexOf(char);
  if (index < 0) throw new Error('baseURL#indexOfBits: Need valid baseURL char');
  return bitString.pad(index.toString(2), 6) ;
}

/**
 * Encode a mod 6 bitstring into a baseURL string
 * @param  {string} bits A mod 6 bitstring
 * @return {string}      baseURL encoded string
 */
function encode (bits) {
  if (!bitString.isValid(bits)) throw new Error('baseURL#encode: bits not valid bitstring');
  if (bits.length % 6 !== 0) throw new Error('baseURL#encode: bits must be a multiple of 6');

  var result = '';
  for (var i = 0; i < bits.length; i = i + 6) {
    result += getChar(bits.slice(i, i + 6 ));
  }
  return result;
}

/**
 * Check if baseURL string is valid
 * @param  {string}  str A valid baseURL string
 * @return {Boolean}     True iff str is valid
 */
function isValid (str) {
  return str != null &&
         typeof str === 'string' &&
        TEST.test(str);
}

/**
 * Decode a baseURL string to a mod 6 bitstring
 * @param  {string} str A valid baseURL string
 * @return {string}     A mod 6 bitstring
 */
function decode (str) {
  if (!isValid(str)) throw new Error('baseURL#decode: str not valid baseURL string');

  var bits = '';
  // Decode
  for (var i = 0; i < str.length; i++) {
    bits += indexOfBits(str[i]);
  }
  return bits;
}



/**
 * Convert a baseURL string to a mod 6 bitstring (0101..)
 * @param  {string} str A valid baseURL string
 * @return {string}     The corresponding base 6 mod 6 bitstring
 */
function toInt (str) {
  return parseInt(decode(str),2);
}

// Public
module.exports.getChar      = getChar;
module.exports.indexOfBits  = indexOfBits;
module.exports.encode       = encode;
module.exports.decode       = decode;
module.exports.isValid      = isValid;
module.exports.toInt        = toInt;
module.exports.ALPHABET     = ALPHABET;

