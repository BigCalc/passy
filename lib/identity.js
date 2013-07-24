// © 2013 QUILLU INC.

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
    throw new Error("Need id");
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

module.exports = identity;
module.exports.verify = verify;
module.exports.EPOC = EPOC;
module.exports.parseDate = parseDate;
