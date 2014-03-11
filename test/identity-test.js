// © 2014 QUILLU INC.
// Mocha identity test
'use strict';

var assert = require('chai').assert;

describe('identity', function () {
  var passy = require('../index');

  [66, 72, 96, 120, 132].forEach(function (bitLength) {
    describe('#identity' + bitLength, function () {
      var identity = passy['identity' + bitLength];
      it('should have a identity function', function () {
        assert.isFunction(identity);
        assert.equal(identity.size, bitLength);
      });

      it('should be have an EPOC', function() {
        assert.instanceOf(identity.EPOC, Date);
        assert.ok(identity.EPOC.getTime() >= 0);
      });

      it('should have date bits', function () {
        assert.isNumber(identity.dateLength);
      });

      it('should have random bits', function () {
        assert.isNumber(identity.randomLength);
      });

      it('should have checksum bits', function () {
        assert.isNumber(identity.checksumLength);
      });

      it('should create a valid baseURL string', function () {
        var baseURL = require('../lib/baseURL');

        for(var i = 0; i < 1000; i++) {
          var result = identity();
          assert.ok(baseURL.isValid(result));
          assert.equal(result.length, bitLength / 6);
          assert.ok(identity.isValid(result));
          assert.instanceOf(identity.toDate(result), Date);
        }
      });

      describe('#toDate', function () {
        it('should not validate invalid ids', function () {
          assert.isFalse(identity.isValid());
          assert.isFalse(identity.isValid(null));
          assert.isFalse(identity.isValid(7));
          assert.isFalse(identity.isValid([]));
          assert.isFalse(identity.isValid({}));
          assert.isFalse(identity.isValid(''));
          assert.isFalse(identity.isValid('BSV#'));
          assert.isFalse(identity.isValid(identity().slice(1)));
        });
      });

      describe('#toDate', function () {
        it('should only accept valid ids', function () {
          [null, 0, [], null, '', {}, '1', 'dsf7&'].forEach( function (id) {
            assert.throws(function () {
              identity.toDate(id);
            }, Error);

          });
        });
      });
    });
  });
});