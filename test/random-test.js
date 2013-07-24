// © 2013 QUILLU INC.
// Mocha random test

var expect = require('chai').expect;

describe('random', function(){
  var random = require('../index').random;

  it('should be callable', function(){
    expect(random).to.be.an.instanceof(Function);
  });

  it('should be have an ALPHABET', function(){
    expect(random.ALPHABET).to.be.an.instanceof(Array);
    expect(random.ALPHABET).to.have.length.above(1);
  });

  it('should be have a DEFAULT', function(){
    expect(random.DEFAULT).to.be.a('number');
    expect(random.DEFAULT).to.be.above(1);
  });

  it('should have DEFAULT length when called with no params', function(){
    var result1 = random(),
        result2 = random(random.DEFAULT);
    expect(result1).to.have.length(result2.length);
  });

  it('should throw Error when called with length 0', function(){
      var fn = function(){ random(0); };
      expect(fn).to.throw(Error);
  });

  it('should throw Error when called with a char', function(){
      var fn = function(){ random('a'); };
      expect(fn).to.throw(Error);
  });

  it('should throw Error when called with []', function(){
      var fn = function(){ random([]); };
      expect(fn).to.throw(Error);
  });

  it('should throw Error when called with {}', function(){
      var fn = function(){ random({}); };
      expect(fn).to.throw(Error);
  });

  it('should return a ID when called with length 12', function(){
    var result = random(12);
    expect(result).to.have.length(12);
  });

  it('should return a ID of length 1-100 when called with lengths 1-100', function(){
    for(var i = 1; i <= 100; i++){
      expect(random(i)).to.have.length(i);
    }
  });

  it('should be uniformly distributed', function(){
    var charset, id, k, lower, m, n, result, upper, v;
    m = n = 64000;
    result = {};
    charset = random.ALPHABET;

    charset.forEach(function(c){
      result[c] = 0;
    });

    while (--n >= 0) {
      id = random(1);
      result[id]++;
    }

    expect(result).to.be.ok;

    lower = (m / charset.length) * 0.90;
    upper = (m / charset.length) * 1.10;

    for (k in result) {
      expect(result[k]).to.be.within(lower, upper);
    }

  });

  describe('#verify', function(){
    var verify = random.verify;

    it('should be callable', function(){
      expect(verify).to.be.an.instanceof(Function);
    });

    it('should return false on null, empty, undef inputs', function(){
      expect(verify()).to.be.false;
      expect(verify(null)).to.be.false;
    });

    it('should return false on non string inputs', function(){
      expect(verify(0)).to.be.false;
      expect(verify(954)).to.be.false;
      expect(verify([])).to.be.false;
      expect(verify({})).to.be.false;
    });

    it('should return false on non ALPHABET characters', function(){
      var specialChars = "±!@£$%^&*()+=[]{};:'\"\|?/,.<>/?~`¡€#¢∞§¶•ªº–≠‘“πø^¨¥†®∑œåß∂ƒ©˙∆˚¬…æ«÷≥≤µ~∫√ç≈Ωé⁄™‹›ﬁﬂ‡°·‚—±’”∏ØÈËÁÊÂ‰„ŒÅÍÎÏÌÓÔÒÚÆ»¿˘¯˜ˆı◊ÇÙÛŸ",
          falses = ['kasdkjhas+', 'a=', 'A$', '3*', 'lkjHD23+', '_+', '-+', 'asdHJK789-_#'];
      falses = falses.concat(specialChars.split(''));
      falses.forEach(function(input) {
        expect(verify(input)).to.be.false;
      });
    });

    it('should return true on ALPHABET characters', function(){
      random.ALPHABET.forEach(function(c){
        expect(verify(c)).to.be.true;
      });

      var trues = ['hed', 'JDH', '234', '-_', 'asdJHK334-_', '-_234sdfLKJ', 'ksdhfjksdoruklsjdfkjh932749239479823KJHKDFHKSHKHDKDKJKJDEH__-____'];
      trues.forEach(function(input){
        expect(verify(input)).to.be.true;
      });
    });
  });

  describe('#parse', function(){
    var parse = random.parse;

    it('should be callable', function(){
      expect(parse).to.be.an.instanceof(Function);
    });

    it('should throw an error on empty, undef inputs', function(){
      var fn = function(){ parse(); };
      expect(fn).to.throw(Error);
    });

    it('should throw an error on null inputs', function(){
      var fn = function(){ parse(null); };
      expect(fn).to.throw(Error);
    });

    it('should return null on non-string inputs', function(){
      expect(parse(0)).to.be.null;
      expect(parse(959)).to.be.null;
      expect(parse([])).to.be.null;
      expect(parse({})).to.be.null;
    });

    it('should parse a string of 1 from the charset', function(){
      random.ALPHABET.forEach(function(c){
        expect(parse(c)).to.be.within(0,63);
      });
    });
  });

});
