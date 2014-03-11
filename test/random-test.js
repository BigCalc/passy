// © 2014 QUILLU INC.
// Mocha random test
'use strict';

var assert = require('chai').assert;

describe('random', function () {
  var random = require('../index').random;

  it('should be callable', function () {
    assert.isFunction(random);
  });

  it('should be have a DEFAULT', function () {
    assert.isDefined(random.DEFAULT);
  });

  it('should have DEFAULT length when called with no params', function () {
    var result1 = random(),
        result2 = random(random.DEFAULT);
    assert.equal(result1.length, result2.length);
  });

  it('should only accept numbers lengths', function () {
    assert.throws(function () {
      random(0);
    }, Error);

    assert.throws(function () {
      random('1');
    }, Error);
  });

  it('should create a random ID', function () {
    assert.isString(random());
  });

  it('should return a ID of length 1-100 when called with lengths 1-100', function () {
    for (var i = 1; i <= 100; i++) {
      assert.lengthOf(random(i), i);
    }
  });

  it('should be uniformly distributed', function () {
    var charset = require('../lib/baseURL').ALPHABET,
        m       = 64000,
        n       = 64000,
        result  = {},
        id, k;
    
    charset.forEach(function (c) {
      result[c] = 0;
    });

    while (--n >= 0) {
      id = random(1);
      result[id]++;
    }

    assert.ok(result);

    for (k in result) {
      if (result.hasOwnProperty(k)) {
        assert.closeTo(result[k], (m / charset.length), (m / charset.length) / 5);
      }
    }

  });

  describe('#isValid', function () {
    var isValid = random.isValid;

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

  describe('#toArray', function () {
    var toArray = random.toArray;

    it('should be callable', function () {
      assert.isFunction(toArray);
    });

    it('should return an Integer Array for for valid baseURL random ID', function () {
      assert.deepEqual(toArray('_'), [37]);
      assert.deepEqual(toArray('_s73e'), [37, 56, 8, 4, 42]);
      assert.deepEqual(toArray('dskfhksjdhf'), [ 41, 56, 48, 43, 45, 48, 56, 47, 41, 45, 43]);
      assert.deepEqual(toArray('KJHFKJH-_sd'), [ 21, 20, 18, 16, 21, 20, 18, 0, 37, 56, 41]);
    });

    it('should only accept numbers lengths', function () {

      assert.throws(function () {
        toArray(null);
      }, Error);

      assert.throws(function () {
        toArray(0);
      }, Error);

      assert.throws(function () {
        toArray('');
      }, Error);

      assert.throws(function () {
        toArray('sdasd%');
      }, Error);

    });

  });
  
});