{vows, should} = require 'testthings'

random = (require '../../index').random

vows.describe('random').addBatch(
  'when random is required':
    topic: -> random
    'it should be function returning default random id': (iden) ->
      should.isFunction iden
    'it should have a ALPHABET': (iden) ->
      should.isArray iden.ALPHABET
      iden.ALPHABET.length.should.be.above(1)
    'it should have a default': (iden) ->
      should.isNumber iden.DEFAULT
      iden.DEFAULT.should.be.above(1)
    'it should should equal calling itself with default': (r) ->
      result1 = r()
      result2 = r r.DEFAULT
      result1.should.have.lengthOf result2.length
    'it should be able to generate ids':
      topic: (r) -> r
      "given length of 0 it should error": (g) ->
        (->
          g(0)
        ).should.throw()
      "given a character it should error": (g) ->
        (->
          g('a')
        ).should.throw()
      "given a [] it should error": (g) ->
        (->
          g([])
        ).should.throw()
      "given a {} it should error": (g) ->
        (->
          g({})
        ).should.throw()
      "given length of 12 it should return a ID": (g) ->
        id = g 12
        should.exist id
        id.should.have.lengthOf(12)
      "given lengths from 1-100, it should return ID 1-100": (g) ->
        [1..100].map (n) ->
          id = g n
          should.exist id
          id.should.have.lengthOf(n)
      "given a id of length 1, it should be uniform": (g) ->
        m = n = 128000
        result = {}
        charset = random.ALPHABET
        charset.map (c) ->
          result[c] = 0

        while --n >= 0
          id = g(1)
          result[id]++

        should.exist result
        lower = (m/charset.length) * 0.90
        upper = (m/charset.length) * 1.10
        for own k,v of result
          v.should.be.within lower, upper
        #   console.log "#{k},#{v}"
    'it should be able to a parse identities':
      topic: (r) -> r.parse
      'parse should be a function': (p) ->
        should.isFunction p
      'parse should throw errors on null, empty, undef inputs': (p) ->
        (->
          p()
        ).should.throw()
        (->
          p(null)
        ).should.throw()
      'parse should return null on non string inputs': (p) ->
        should.strictEqual null, p(0)
        should.strictEqual null, p(959)
        should.strictEqual null, p([])
        should.strictEqual null, p({})
      'parse should parse a string of 1 from the charset': (p) ->
        chars = random.ALPHABET
        result = (p(c) for c in chars)
        should.exist result
        result.should.have.lengthOf(chars.length)
        r[0].should.be.within(0,63) for r in result
    'it should be able to verify ids':
      topic: (r) -> r.verify
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
      'verify should return false on non ALPHABET characters': (v) ->
        specialChars ="±!@£$%^&*()+=[]{};:'\"\|?/,.<>/?~`¡€#¢∞§¶•ªº–≠‘“πø^¨¥†®∑œåß∂ƒ©˙∆˚¬…æ«÷≥≤µ~∫√ç≈Ωé⁄™‹›ﬁﬂ‡°·‚—±’”∏ØÈËÁÊÂ‰„ŒÅÍÎÏÌÓÔÒÚÆ»¿˘¯˜ˆı◊ÇÙÛŸ"
        falses = [
          'kasdkjhas+'
          'a='
          'A$'
          '3*'
          'lkjHD23+'
          '_+'
          '-+'
          'asdHJK789-_#'
        ]
        falses = falses.concat specialChars.split('')
        falses.map (input) ->
          v(input).should.be.false
      'verify should return true on ALPHABET characters': (v) ->
        chars = random.ALPHABET
        v(c).should.be.true for c in chars
        trues =[
          'hed'
          'JDH'
          '234'
          '-_'
          'asdJHK334-_'
          '-_234sdfLKJ'
          'ksdhfjksdoruklsjdfkjh932749239479823KJHKDFHKSHKHDKDKJKJDEH__-____'
        ]
        trues.map (input) ->
          v(input).should.be.true
).export module
