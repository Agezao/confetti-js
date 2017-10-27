'use strict';

var gulp = require('gulp');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var minify = require('gulp-minify');

// JS building
var scriptsToBundle = ['./dist/index.js'];

gulp.task('bundle-js', function() {
  return gulp.src(scriptsToBundle)
    .pipe(concat('index.js'))
    .pipe(minify({
      ext:{
        src:'.js',
        min:'.min.js'
      }
    }))
    .pipe(gulp.dest('./dist'))
});

///////

gulp.task('default', ['bundle-js']);