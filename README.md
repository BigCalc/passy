# Passy #

[![Build Status](https://travis-ci.org/BigCalc/passy.png?branch=master)](https://travis-ci.org/BigCalc/passy)

[![NPM](https://nodei.co/npm/passy.png?downloads=true)](https://nodei.co/npm/passy/)

Passy is a CommonJS module for Node.js that has identity and random id generations functions. It's used baseURL encoding and created ids of various predefined lengths (with built in creation dates) and also pure random ids of any length. Time based ids store the creation date within, so don't require additional storage for a 'created' field which is useful for in-memory DBs like REDIS.

## baseURL ##
baseURL is a simple encoding scheme where each character represents 64 values which work safely in URLs ie (0-9a-zA-Z-_). Each ASCII character encodes 6 binary bits. Input binary numbers must be divisible by 6; unlike base64 there is no scheme to encode variable length binary inputs. Bit lengths which are multiples of 6 & 8 tend to be the most efficient for humans and machines.

## Install ##

```
npm install --save passy
```

## Usage ##

### Identity ###

```js

var passy = require('passy');

var id = passy.identity66();
console.log(id); // '-gDzpbAJNzl'

identity.isValid(id); // true
identity.isValid(121) // false

var date = identity.toDate(id)
console.log(date); // Wed Jul 24 2013 11:05:33 GMT+0100 (BST)

```

### Random ###

```js
var random = require('passy').random;

var url = random();
console.log(url); // 5I13rNbNgttU

random.isValid(url); // true
random.isValid('3%') // false

var raw =  random.toArray(url);
console.log(raw); // [ 5, 44, 1, 3, 27, 49, 11, 49, 16, 29, 29, 56 ]

```

See code and tests for detailed info.
 
## Developer ###
Create Github issues for all bugs, features & requests. Pull requests are welcome.

## Test ###
Test with `npm test`

## License ##
[BSD 3-Clause](LICENSE)
