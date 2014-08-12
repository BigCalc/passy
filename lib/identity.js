// © 2014 QUILLU INC.
// Identity
'use strict';

// Create a 64bit binary (66bit baseURL encoded) ID.

// The JavaScript date encoded as milliseconds since
// midnight 01 January, 1970 UTC.
// A day holds 86,400,000 milliseconds.
// The JavaScript Date object range is -100,000,000 days
// to 100,000,000 days relative to 01 January, 1970 UTC.
// We trim this to 42 bits of ms since Unix EPOC
// 42bits gives  2^(42) ms = 4,398,046,511,104 ms
// 281,474,976,710,656 / (365.242 * 24 * 60 * 60 * 1000 ) = 139.37.. years
// Given Unix EPOC, this wont overfill till ~2,109 AD
//
// Next 22 bits (3 bytes) are random
// 2^22 = 4,194,304 ids per each ms
// However these are assigned probabilistically not sequentially so need to
// consider birthday paradox for collisions
//
// Probability collision
// p(n;d) = 1 - exp(-n(n-1)/(2*d))
// 1k   rows per s: p(2^22; 1)    = 0        * 1k   =   0
// 10k  rows per s: p(2^22; 10)   = 1 - ((1 - 0.000011) * 10k)  =
// 50k  rows per s: p(2^22; 50)   = 0.00029
// 100k rows per s: p(2^22; 100)  = 0.001
// 500k rows per s: p(2^22; 500   = 0.029
// 1M   rows per s: p(2^22; 1k)   = 0.11
// 2M   rows per s: p(2^22; 2k)   = 0.38
// 3M   rows per s: p(2^22; 3k)   = 0.65
// 10M  rows per s: p(2^22; 10k)  = 0.99

// If your generating more than 1M ids per sec, then consider adding more random bytes

// The resultant 64bit number is encoded via baseURL
// And add 2 extra bits for parity.
// ie, 66bits (11 baseURL chars) when stored as string
// and stripped to 64bits (excluding parity) when in integer respresantion for efficiency
// This is similar to base64, but with URL compatible chars, and
// with considerations for DB indexing.
// This gives a 11char ID, which is short and user friendly, and can be used
// on client, server and db efficiently with no synchronization
// When encoded as a integer, it will fit easily in 8 Bytes (a register on a 64bit CPU)
// Consider using last 4bits for more random entropy

// bit ops don't work on number > 2^31 !
// Use binary string!
//
//   // MAX int 2^53, or 9007199254740992

var bitString = require('./bitString'),
    baseURL   = require('./baseURL');

/**
 * Get Milliseconds since supplied epoc, using 
 * highres timers if availiable
 * @private
 * @param  {Date} epoc The epoc to use
 * @return {string}      Millisoncds encoded as bitstring
 */
function _getDateMillis (epoc) {
  // Use highres time if availiable as JS date is +- 15ms
  try {
    var microtime = require('microtime');
    // Time in microsecs, convert to ms
    return (Math.round(microtime.now() / 1000) - epoc.getTime()).toString(2);
  } catch (err) {}

  return ((new Date()) - epoc).toString(2);
}

/**
 * Build an identity function
 * @private
 * @param  {integer} ndate     Size of date bits
 * @param  {integer} nrandom   Size of random bits
 * @param  {integer} nchecksum Size of checksum bits
 * @param  {Date} epoc         Epoc to use
 * @return {string}            BaseURL encoded id
 */
function _identity (ndate, nrandom, nchecksum, epoc) {
  // ms since EPOC (1 Jan 1970)
  var since = _getDateMillis(epoc);

  // Max of ndate
  if (since.length > ndate) {
    throw new Error('Date too big');
  }

  // Pad to ndate
  since = bitString.pad(since, ndate);

  // Add nrandom Random bits
  since += bitString.randomBits(nrandom);

  // Add checksum bits
  since += bitString.checksum(since, nchecksum);

  // Convert to BaseURL
  return baseURL.encode(since);
}

/**
 * Check if a id is valid
 * @private
 * @param  {integer} ndate     Size of date bits
 * @param  {integer} nrandom   Size of random bits
 * @param  {integer} nchecksum Size of checksum bits
 * @param  {string}  id        BaseURL encoded Id to test
 * @return {Boolean}           [description]
 */
function _isValid (ndate, nrandom, nchecksum, id) {
  // Guard
  if (!baseURL.isValid(id)) return false;
  if (id.length !== (ndate + nrandom + nchecksum) / 6) return false;

  // Test
  var bits = baseURL.decode(id),
    main = bits.slice(0, bits.length - nchecksum),
    check = bits.slice(bits.length - nchecksum, bits.length);

  return bitString.checksum(main, nchecksum) === check;
}

/**
 * Get date from id
 * @private
 * @param  {integer} ndate     Size of date bits
 * @param  {integer} nrandom   Size of random bits
 * @param  {integer} nchecksum Size of checksum bits
 * @param  {Date} epoc         Epoc to use
 * @param  {string}  id        BaseURL encoded Id to test
 * @return {Date}              The date of id creation
 */
function _toDate (ndate, nrandom, nchecksum, epoc, id) {
  // Guard
  if (!_isValid(ndate, nrandom, nchecksum, id)) throw new Error('identity#toDate: Invalid Id');

  // Calculate
  var bits = baseURL.decode(id),
    dateBits = bits.slice(0, ndate);
  return new Date(parseInt(dateBits, 2) + epoc.getTime());
}

/**
 * Build a identity function by currying 
 * @private
 * @param  {integer} ndate     Size of date bits
 * @param  {integer} nrandom   Size of random bits
 * @param  {integer} nchecksum Size of checksum bits
 * @param  {Date} epoc         Epoc to use
 * @return {Function}          A identity function
 */
function createIdentity (ndate, nrandom, nchecksum, epoc) {
  var def = function identity () {
    return _identity(ndate, nrandom, nchecksum, epoc);
  };

  def.EPOC = epoc;
  def.dateLength = ndate;
  def.randomLength = nrandom;
  def.checksumLength = nchecksum;
  def.size = ndate + nrandom + nchecksum;

  def.isValid = function isValid(id) {
    return _isValid(ndate, nrandom, nchecksum, id);
  };
  def.toDate = function toDate(id) {
    return _toDate(ndate, nrandom, nchecksum, epoc, id);
  };

  return def;
}

// Public
// 11 chars (66bits - 64 bits (8 bytes) binary by stripping checksum
// 41 bits date:  274,877,906,944 ms since 1 Jan 2014
// gives 8.71 years till 2,022.71AD
// p(collision) > 0.5: 37 per ms for 1 sec
module.exports.identity66 = createIdentity(39, 25, 2, new Date('1 JAN 2014'));

// 12 chars (72 bits - 9 bytes)
// 41 bits date: 549,755,813,888 ms since 1 Jan 2014
// gives 17.42 years till 2,031.42AD
// p(collision) > 0.5: 4 per ms for 1 day
module.exports.identity72 = createIdentity(39, 31, 2, new Date('1 JAN 2014'));

// 16 chars (96 bits - 12 bytes)
// 41 bits date: 1,099,511,627,776 ms since 1 Jan 2014
// gives 34.84 years till 2,048.84AD
// p(collision) > 0.5: 28 per ms for 10years
module.exports.identity96 = createIdentity(40, 52, 4, new Date('1 JAN 2014'));

// 20 chars (120bits - 15 bytes )
// 41 bits date: 2,199,023,255,552 ms since 1 Jan 1970
// gives 69.68 years till 2,039.68AD
// p(collision) > 0.5: >11400 per ms for 10years
module.exports.identity120 = createIdentity(41, 75, 4, new Date(0));

// 22 chars (132bits - 128bits (16 bytes) by stripping checksum)
// 42 bits date: 4,398,046,511,104ms since 1 Jan 1970
// gives 139.37 years till 2,109.37AD
// p(collision) > 0.5: > 516,000 per ms for 10years
module.exports.identity132 = createIdentity(42, 86, 4, new Date(0));
