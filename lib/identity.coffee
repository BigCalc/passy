crypto = require 'crypto'
EPOC = new Date '01-JAN-2012'
REGX = /^[0-9a-f]{16}$/m

identity = ->
  since = new Date() - EPOC
  sinceHex = since.toString 16

  throw new Error ('Date too big') if sinceHex.length > 10

  while sinceHex.length < 10
    sinceHex = '0' + sinceHex

  buf = crypto.randomBytes 3
  sinceHex+buf.toString 'hex'

verify = (id) ->
  return false unless id? and typeof id is 'string'
  REGX.test id

parseDate = (id) ->
  throw new Error "Need id" unless id?
  throw new Error 'Invalid Id' unless verify id

  time = id.slice 0, 10
  timeMilis = parseInt time, 16
  timeSinceUnix = timeMilis + EPOC.getTime()
  new Date timeSinceUnix

# Public
module.exports = identity
module.exports.verify = verify
module.exports.EPOC = EPOC
module.exports.parseDate = parseDate
