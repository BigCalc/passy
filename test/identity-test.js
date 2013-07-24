// © 2013 QUILLU INC.
// Mocha identity test

var expect = require('chai').expect;

describe('identity', function(){
  var identity = require('../index');

  it('should be callable', function(){
    expect(identity).to.be.an.instanceof(Function);
  });

  it('should be have an EPOC', function(){
    expect(identity.EPOC).to.be.a('Date');
    expect(identity.EPOC.getTime()).to.be.above(1);
  });

  describe('creating a timebased 64bit id', function(){

    it('should create a 16 char hex string', function(){
      var result = identity();
      expect(result).to.match(/[0-9a-f]{16}/);
      expect(result).to.have.length(16);
    });

    it('should have the first 10 chars (5bytes) be a date since Epoc', function(){
      var result = identity(),
          timeNow = Date.now();
      var timeStamp = result.slice(0.1, 10);
      var timeStampMillis = parseInt(timeStamp, 16);
      var timeSinceUnix = timeStampMillis + identity.EPOC.getTime();
      expect(timeNow).to.not.be.below(timeSinceUnix);
      var date = new Date(timeSinceUnix);
      expect(date.valueOf()).to.be.a('number');
    });

    it('should have the last 6 chars (3bytes) be random', function(){
      // Just check 3 times (while extremely unlikely, not guaranteed.)
      var result1 = parseInt(identity().slice(10, 16), 16),
          result2 = parseInt(identity().slice(10, 16), 16),
          result3 = parseInt(identity().slice(10, 16), 16);
      expect(result1).to.not.equal(result2).to.not.equal(result3);
    });

  });

  describe('#verify', function(){
    var verify = identity.verify;

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

    it('should return false on non 16 char hex strings', function(){
      expect(verify('')).to.be.false;
      expect(verify('12')).to.be.false;
      expect(verify('12ab')).to.be.false;
      expect(verify('z')).to.be.false;
      expect(verify('ab71282af18376530')).to.be.false;
      expect(verify('ab71282af183765308374')).to.be.false;
      expect(verify('abz1282af18376530')).to.be.false;
      expect(verify('au71282a')).to.be.false;
    });

    it('should return true on 16 char hex strings', function(){
      expect(verify('0089e946812a2d94')).to.be.true;
      expect(verify('0089e94998a4a080')).to.be.true;
      expect(verify('0089e94b294bff31')).to.be.true;
      expect(verify('0089e9b2b2b7c2d3')).to.be.true;
    });
  });

  describe('#parseDate', function(){
    var parseDate = identity.parseDate;

    it('should be callable', function(){
      expect(parseDate).to.be.an.instanceof(Function);
    });

    it('should throw an error for an invalid id', function(){
      var fn = function(){ parseDate('skdj'); };
      expect(fn).to.throw(Error);
    });

    it('should get a date for a valid id', function(){
      var date1 = parseDate('0089e946812a2d94'),
          date2 = new Date(parseInt('0089e94681', 16) + identity.EPOC.getTime());
      expect(date1).to.eql(date2);
    });
  });

});
