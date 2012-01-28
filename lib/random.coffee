crypto = require 'crypto'
DEFAULT = 12
ALPHABET = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_-'.split('')
REGX = /^[A-Za-z0-9-_]+$/m

random =  (length = DEFAULT) ->
  throw new Error "Length should be +ve Number" unless typeof length is 'number' and length > 0

  buf = crypto.randomBytes length
  (ALPHABET[buf[c] & 0x3F] for c in [0..length-1]).join('')

parse = (id) ->
  throw new Error "Need id" unless id?
  return null unless typeof id is 'string' and verify id

  raw = (ALPHABET.indexOf c for c in id.split(''))

verify = (id) ->
  return false unless id? and typeof id is 'string'
  REGX.test id

# Public
module.exports = random
module.exports.parse = parse
module.exports.verify = verify
module.exports.ALPHABET = ALPHABET
module.exports.DEFAULT = DEFAULT
