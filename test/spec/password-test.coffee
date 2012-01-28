{vows, should} = require 'testthings'

password = (require '../../index').password

vows.describe('password').addBatch(
  'when password is mixedin':
    topic: password
    'it should generate a salt': (c) ->
      should.isFunction c.generateSalt
      c.generateSalt 10, (err, salt) ->
        should.not.exist(err)
        should.exist(salt)

    'it should generate a hashed password': (c) ->
      should.isFunction c.generate
      pass='I am a Cr@zy p0ssw*rd'

      c.generate pass, (err, password) ->
        should.not.exist(err)
        should.exist(password)
        password.should.not.equal(pass)

    'it should respond verify a password / hash combo': (c) ->
      should.isFunction c.verify

).export module
