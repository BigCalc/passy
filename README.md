Passy Source
============

This is a utility module for common password related code.
Ensures best practices.

Install
-------
```
npm install passy
```

Usage
-----

```coffee-script

passy = require 'passy'

passy.generate 'abcd123', (err, hash) ->
  throw err if err?
  db.store hash

passy.verify password, hash, (err, same) ->
	throw err if err?
	if same
		console.log 'login sucessfull'
	else
		console.log 'wrong password'

passy.generateSalt 10, (err, salt) ->
	throw err if err?
	console.log salt

```

Features
--------

* Currently wraps bcrypt


Developer instructions
----------------------

* Ensure git, node and npm are installed
* git clone git@github.com:<username>/<project>.git
* switch to dev branch, and make it track origin/dev
* run npm install
* run npm link ( this installs dev dependencies and symlinks the project to your global npm registry)
* Install the following globally via npm install -g
** coffee-script
** nodemon
** vows

CakeFile
--------
A Cakefile is used to manage the app
type cake at the root directory to see a list of commands

Developer flow
--------------
Follow github best practices

* Update to latest from master (should be fast forward)
* Create a new feature branch off master
* Push branch to origin
* Write a test
* Make test pass
* Refactor
* Commit
* Push to remote branch
* Repeat till feature is finished
* Then update master to latest from origin (should be fast forward)
* Rebase your branch to be ontop of master
* Squash your commits into a atomic feature commit (should have a big log message auto created from the little commits)
* Merge onto master, and push (should be fast-forward)
* Once ready for release, tag master.
* Make branch bugfixes on a version branch off master
