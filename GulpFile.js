// © 2014 QUILLU INC.
// things GulpFile
'use strict';

var gulp     = require('gulp'),
    jsonlint = require('gulp-json-lint'),
    jshint   = require('gulp-jshint'),
    shell    = require('gulp-shell'),
    sloc     = require('gulp-sloc'),
    mocha    = require('gulp-mocha');

var CODE_FILES = ['GulpFile.js', 'lib/**/*.js'],
    TEST_FILES = ['test/**/*.js'],
    ALL_FILES  = ['GulpFile.js', 'lib/**/*.js', 'test/**/*.js'];

gulp.task('install', shell.task([
  'npm install',
  'npm prune'
]));

gulp.task('jsonlint', function () {
  return gulp.src('./*.json')
    .pipe(jsonlint())
    .pipe(jsonlint.report('verbose'));
});

gulp.task('jshint', function () {
  return gulp.src(ALL_FILES)
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('sloc', function () {
  return gulp.src(ALL_FILES)
    .pipe(sloc());
});

// Remeber to bump version with npm version
gulp.task('publish', ['default'], shell.task([
  'git push',
  'git push --tags',
  'npm publish'
]));

function _test () {
  return gulp.src(TEST_FILES, {read: false})
    .pipe(mocha({R:'spec'}))
    .on('error', function(){});
}

gulp.task('test', function () {
  return _test().on('error', function (e) {
    throw e;
  });
});
  
gulp.task('tdd', function () {
  gulp.watch(ALL_FILES, _test);
  _test();
});

// Default Task
gulp.task('default', ['jsonlint', 'jshint', 'test']);
