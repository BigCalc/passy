// © 2014 QUILLU INC.
// BitString Mocha test
'use strict';

var assert = require('chai').assert;

describe('bitString', function () {
  var bitString = require('../lib/bitString');

  it('should be exist', function () {
    assert.isDefined(bitString);
  });

  describe('#pad', function () {
    var pad =  bitString.pad;

    it('should be callable', function () {
      assert.isFunction(pad);
    });

    it('should pad strings', function () {
      assert.equal(pad('1', 1), '1');
      assert.equal(pad('11', 5), '00011');
      assert.equal(pad('bob', 8), '00000bob');
    });

    it('should pad strings with custom pad', function () {
      assert.equal(pad('1', 1, 'f'), '1');
      assert.equal(pad('11', 5, 'f'), 'fff11');
      assert.equal(pad('bob', 8, 'g'), 'gggggbob');
    });

    it('should only accept strings', function () {
      assert.throws(function (){
        pad(null);
      }, Error);

      assert.throws(function (){
        pad(1);
      }, Error);
    });

  });

  describe('#isValid', function () {
    var isValid = bitString.isValid;

    it('should be callable', function () {
      assert.isFunction(isValid);
    });

    it('should return true for valid bitstrings strings', function () {
      assert.ok(isValid('1'));
      assert.ok(isValid('010101'));
      assert.ok(isValid('11111'));
      assert.ok(isValid('1010101001010101010'));
    });

    it('should return false for invalid bitstrings', function () {
      assert.notOk(isValid(null));
      assert.notOk(isValid(23));
      assert.notOk(isValid('$%@@@'));
      assert.notOk(isValid('!WJSHBDJGS'));
    });

  });

  describe('#checksum', function () {
    var checksum = bitString.checksum;

    it('should be callable', function () {
      assert.isFunction(checksum);
    });

    it('should return a 2bit checksum for valid bitstrings strings', function () {
      assert.equal(checksum('10100', 2), '00');
      assert.equal(checksum('10101', 2), '11');
      assert.equal(checksum('1110101010', 2), '10');
      assert.equal(checksum('1110101011', 2), '01');
      assert.equal(checksum('111101011', 2), '11');
    });

    it('should return a n-bit checksum for valid bitstrings strings', function () {
      assert.equal(checksum('10100', 4), '0010');
      assert.equal(checksum('10101', 4), '0111');
      assert.equal(checksum('101011111', 6), '001001');
      assert.equal(checksum('101011111001', 6), '101010');
    });


    it('should only accept valid bitstrings', function () {
      assert.throws(function (){
        checksum(null);
      }, Error);

      assert.throws(function (){
        checksum(1);
      }, Error);
    });

    it('should only accept valid checksum sizes', function () {
      assert.throws(function (){
        checksum('11', 1);
      }, Error);

      assert.throws(function (){
        checksum('11', 5);
      }, Error);
    });

  });

  describe('#randomBits', function () {
    var randomBits = bitString.randomBits;

    it('should be callable', function () {
      assert.isFunction(randomBits);
    });

    it('should return some random bits', function () {
      assert.lengthOf(randomBits(1), 1);
      assert.lengthOf(randomBits(2), 2);
      assert.lengthOf(randomBits(32), 32);
      assert.lengthOf(randomBits(400), 400);
    });

    it('should only accept a valid number', function () {
      assert.throws(function (){
        randomBits(null);
      }, Error);

      assert.throws(function (){
        randomBits('hello');
      }, Error);
    });

  });

});
