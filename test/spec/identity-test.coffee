{vows, should} = require 'testthings'

identity = require '../../index'

vows.describe('identity').addBatch(
  'when identity is required':
    topic: -> identity
    'it should be function': (iden) ->
      should.isFunction iden
    'it should have a epoc': (iden) ->
      iden.EPOC.should.be.an.instanceof Date
      iden.EPOC.getTime().should.be.above(1)
    'when it creates a timebased 64bit ids':
      'it should be a 16 char hex string': (iden) ->
        result = iden()
        result.should.match /[0-9a-f]{16}/
        result.should.have.lengthOf 16
      'the first 10 chars (5bytes) should be a date since Epoc': (iden) ->
        result = iden()
        timeNow = Date.now()
        timeStamp = result.slice 0, 10
        timeStampMillis = parseInt timeStamp, 16
        timeSinceUnix = timeStampMillis + iden.EPOC.getTime()
        timeNow.should.not.be.below timeSinceUnix
        date = new Date timeSinceUnix
        date.valueOf().should.isNumber
      'the last 6 chars (3bytes) should be a random': (iden) ->
        results = (parseInt(iden().slice(10, 16),16) for num in [0..1000])
        results = results.sort()
        results[i].should.not.equal results[i+1] for i in [0..results.length-2]
    'it should be able to verify ids':
      topic: (iden) -> iden.verify
      'verify should be a function': (v) ->
        should.isFunction v
      'verify should return false on null, empty, undef inputs': (v) ->
        v().should.be.false
        v(null).should.be.false
      'verify should return false on non string inputs': (v) ->
        v(0).should.be.false
        v(954).should.be.false
        v([]).should.be.false
        v({}).should.be.false
      'verify should return false on non 16 char hex strings': (v) ->
        v('').should.be.false
        v('12').should.be.false
        v('12ab').should.be.false
        v('z').should.be.false
        v('ab71282af18376530').should.be.false
        v('ab71282af183765308374').should.be.false
        v('abz1282af18376530').should.be.false
        v('au71282a').should.be.false
      'verify should return true on 16 char hex strings': (v) ->
        v('0089e946812a2d94').should.be.true
        v('0089e94998a4a080').should.be.true
        v('0089e94b294bff31').should.be.true
        v('0089e9b2b2b7c2d3').should.be.true
    'it should be able to parse dates from a valid id':
      topic: (iden) -> iden.parseDate
      'parseDate should throw an error for an invalid id': (g) ->
        (->
            g('skdj')
        ).should.throw()
      'parseDate should get a date for a valid id': (g) ->
        date1 = g('0089e946812a2d94')
        date2 = new Date (parseInt('0089e94681', 16) + identity.EPOC.getTime())
        date1.should.eql date2
).export module
