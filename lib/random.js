// © 2013 QUILLU INC.
// Random

var crypto = require('crypto'),
    DEFAULT = 12, //64 bits
    ALPHABET = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_-'.split(''),
    REGX = /^[A-Za-z0-9-_]+$/m;

// Random
module.exports = function(length) {
  // Guard
  if (length == null) {
    length = DEFAULT;
  }
  else if (!(typeof length === 'number' && length > 0)) {
    throw new Error("Length should be +ve Number");
  }
  // Fill buffer
  var buf = crypto.randomBytes(length),
      result = '';
  // Concat result
  for (var i = 0; i < length; i++) {
    result += ALPHABET[buf[i] & 0x3F]; // Only take last 6 bits (0-63)
  }
  return result;
};

var verify = function(id) {
  // Guard
  if (!((id != null) && typeof id === 'string')){
    return false;
  }
  // Test
  return REGX.test(id);
};

var parse = function(id){
  // Guard
  if (id == null) {
    throw new Error("Need id");
  }
  else if (!(typeof id === 'string' && verify(id))) {
    return null;
  }
  // Decode
  var result = [];
  for (var i = 0; i < id.length; i++){
    result.push(ALPHABET.indexOf(id[i]));
  }
  return result;
};

module.exports.verify = verify;
module.exports.parse = parse;
module.exports.ALPHABET = ALPHABET;
module.exports.DEFAULT = DEFAULT;
