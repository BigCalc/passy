// © 2014 QUILLU INC.
// Identity
'use strict';

// Get a Hex encoded 64-bit id (8 bytes length) 16 hex chars
// First 5 bytes encode date
// Saves milliseconds since Jan 2012
// 5 byes gives  2^(8*5) ms = 1099511627776 ms
// 1099511627776 / (364.25 * 24 * 60 * 60 * 1000 ) = 34.93707...
// ~ 35 years from 2012 (so Jan 2047)
// Next 3 bytes are random
// 2^8 (16777216) ids per each ms

var crypto = require('crypto'),
    EPOC = new Date('01-JAN-2012'),
    REGX = /^[0-9a-f]{16}$/m;

var identity = function() {
  var buf, since, sinceHex;
  since = new Date() - EPOC;
  sinceHex = since.toString(16);

  if (sinceHex.length > 10) {
    throw new Error('Date too big');
  }

  while (sinceHex.length < 10) {
    sinceHex = '0' + sinceHex;
  }
  buf = crypto.randomBytes(3);

  return sinceHex + buf.toString('hex');
};

var verify = function(id) {
  // Guard
  if (!((id != null) && typeof id === 'string')) {
    return false;
  }
  // Test
  return REGX.test(id);
};

var parseDate = function(id) {
  var time, timeMilis, timeSinceUnix;
  // Guard
  if (id == null) {
    throw new Error('Need id');
  }
  if (!verify(id)) {
    throw new Error('Invalid Id');
  }
  // Calculate
  time = id.slice(0, 10);
  timeMilis = parseInt(time, 16);
  timeSinceUnix = timeMilis + EPOC.getTime();
  return new Date(timeSinceUnix);
};

// Exports
module.exports = identity;
module.exports.verify = verify;
module.exports.EPOC = EPOC;
module.exports.parseDate = parseDate;
