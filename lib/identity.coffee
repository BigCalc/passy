crypto = require 'crypto'
DEFAULT = 12
CORPUS = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_-'.split('')
REGX = /^[A-Za-z0-9-_]+$/m

identity = ->
  generate DEFAULT

# Each Char maps to one of 64 characters. 6bits per char 2^6 = 64
generate = (length) ->
  throw new Error "Need arg length" unless length?
  throw new Error "Length should be +ve Number" unless typeof length is 'number' and length > 0

  buf = crypto.randomBytes length
  (CORPUS[buf[c] & 0x3F] for c in [0..length-1]).join('')
  
parse = (id) ->
  throw new Error "Need id" unless id?
  return null unless typeof id is 'string' and verify id

  raw = (CORPUS.indexOf c for c in id.split(''))

verify = (id) ->
  return false unless id? and typeof id is 'string'
  REGX.test id

# Public
module.exports = identity
module.exports.generate = generate
module.exports.parse = parse
module.exports.verify = verify
module.exports.CORPUS = CORPUS
module.exports.DEFAULT = DEFAULT