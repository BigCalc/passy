{vows, should} = require 'testthings'

password = require '../../index'

vows.describe('password').addBatch(
  'when password is mixedin':
    topic: password
    'it should generate a salt': (c) ->
      should.isFunction c.generateSalt
    'it should generate a hashed password': (c) ->
      should.isFunction c.generate
    'it should respond verify a password / hash combo': (c) ->
      should.isFunction c.verify

).export module
