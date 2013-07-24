# Passy <sup>[![Version Badge](http://vb.teelaun.ch/BigCalc/passy.svg#0.5.0)](https://npmjs.org/package/passy)</sup> #

[![Build Status](https://travis-ci.org/BigCalc/passy.png?branch=master)](https://travis-ci.org/BigCalc/passy)

[![NPM](https://nodei.co/npm/passy.png?downloads=true)](https://nodei.co/npm/passy/)

Passy is a CommonJS module for Node.js that has identiy and random id generations functions. It allows easy generations, verification and parsing of hex encoded 64bit time based ids, or variable length URL encoded random ids. Time based ids store the creation date within, so don't require additional storage for a 'created' field which is useful for in-memoery DBs like REDIS. URL encoded random ids only use the characters (0-9a-zA-Z-_) which can be safely used in URLs, and provide 64 bits of entropy per character.

## Install ##

```
npm install --save passy
```

## Usage ##

### Identity ###

```js

var identity = require('passy');

var id = identity();
console.log(id); // 0b79934122140ad5

identity.verify(id); // true
identity.verify(121) // false

var date = identity.parseDate(id)
console.log(date); // Wed Jul 24 2013 11:05:33 GMT+0100 (BST)

```

### Random ###

```js
var random = require('passy').random;

var url = random();
console.log(url); // 5I13rNbNgttU

random.verify(url); // true
random.verify('3%') // false

var raw =  random.parse(url);
console.log(raw); // [ 5, 44, 1, 3, 27, 49, 11, 49, 16, 29, 29, 56 ]

```
 
## Developer ###
Create Github issues for all bugs, features & requests. Pull requests are welcome.

## Test ###
Test with `npm test`

## License ##
[BSD 3-Clause](LICENSE)
