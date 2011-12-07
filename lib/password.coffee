bcrypt = require 'bcrypt'

module.exports = 

  generateSalt: (len, cb) ->
    bcrypt.gen_salt len, cb

  generate: (password, cb) ->
    bcrypt.gen_salt 10, (err, salt) ->
      return cb err if err?
   	  bcrypt.encrypt password, salt, cb 

  verify: (password, hash, cb) ->
    bcrypt.compare password, hash, cb 
