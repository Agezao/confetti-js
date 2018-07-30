'use strict';

var gulp = require('gulp');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var minify = require('gulp-minify');

// JS building
var scriptsToBundle = ['./dist/index.js'];

function build() {
  return gulp.src(scriptsToBundle)
    .pipe(concat('index.js'))
    .pipe(minify({
      ext:{
        src:'.js',
        min:'.min.js'
      }
    }))
    .pipe(gulp.dest('./dist'))
};

///////

exports.build = build;
exports.default = gulp.series(build);