// © 2014 QUILLU INC.
// baseURL Mocha test
'use strict';

var assert = require('chai').assert;

describe('baseURL', function () {
  var baseURL = require('../lib/baseURL');

  it('should be exist', function () {
    assert.isDefined(baseURL);
  });

  it('should be have an ALPHABET', function () {
    assert.isArray(baseURL.ALPHABET);
  });

  describe('#getChar', function () {
    var getChar = baseURL.getChar;

    it('should be callable', function () {
      assert.isFunction(getChar);
    });

    it('should convert a bitstring to char', function () {
      assert.equal(getChar('1'), '0');
      assert.equal(getChar('101'), '4');
      assert.equal(getChar('10001'), 'G');
    });

    it('should only accept numbers', function () {
      assert.throws(function (){
        getChar(null);
      }, Error);

      assert.throws(function (){
        getChar('hello');
      }, Error);
    });

    it('should only accept numbers between 0-63', function () {
      assert.throws(function (){
        getChar('1000001');
      }, Error);
    });

  });

  describe('#indexOf', function () {
    var indexOfBits = baseURL.indexOfBits;

    it('should be callable', function () {
      assert.isFunction(indexOfBits);
    });

    it('should get the indexof a valid baseURL char', function () {
      assert.equal(indexOfBits('_'), '100101');
      assert.equal(indexOfBits('0'), '000001');
    });

    it('should only accept valid baseURL chars', function () {
      assert.throws(function (){
        indexOfBits(null);
      }, Error);

      assert.throws(function (){
        indexOfBits('heloo');
      }, Error);

      assert.throws(function (){
        indexOfBits('1000001');
      }, Error);

    });

  });

  describe('#encode', function () {
    var encode = baseURL.encode;

    it('should be callable', function () {
      assert.isFunction(encode);
    });

    it('should encode a bitstring into a baseURL string', function () {
      assert.equal(encode('100101'), '_');
      assert.equal(encode('110101101101'), 'ph');
      assert.equal(encode('101111001010010101101101'), 'j9Kh');
    });

    it('should only accept valid bitstring of length mod 6', function () {
      assert.throws(function (){
        encode(null);
      }, Error);

      assert.throws(function (){
        encode('heloo');
      }, Error);

      assert.throws(function (){
        encode('10101011');
      }, Error);

    });

  });

  describe('#decode', function () {
    var decode = baseURL.decode;

    it('should be callable', function () {
      assert.isFunction(decode);
    });

    it('should decode a baseURL string into a bitstring', function () {
      assert.equal(decode('_'), '100101');
      assert.equal(decode('ph'), '110101101101');
      assert.equal(decode('j9Kh'), '101111001010010101101101');
    });

    it('should only accept valid bitstring of length mod 6', function () {
      assert.throws(function (){
        decode(null);
      }, Error);

      assert.throws(function (){
        decode('hel$oo');
      }, Error);

      assert.throws(function (){
        decode(1);
      }, Error);

    });

  });

  describe('#isValid', function () {
    var isValid = baseURL.isValid;

    it('should be callable', function () {
      assert.isFunction(isValid);
    });

    it('should return true for valid baseURL strings', function () {
      assert.ok(isValid('_'));
      assert.ok(isValid('_abS_'));
      assert.ok(isValid('asbsadGG'));
      assert.ok(isValid('_-TTSTSTGHSGSHGHGWJSHBDJGS'));
    });

    it('should return false for invalid baseURL strings', function () {
      assert.notOk(isValid(null));
      assert.notOk(isValid(23));
      assert.notOk(isValid('$%@@@'));
      assert.notOk(isValid('!WJSHBDJGS'));
    });

  });

});
