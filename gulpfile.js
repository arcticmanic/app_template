"use strict"

var gulp = require('gulp'),
		connect = require('gulp-connect'),
		opn = require('opn'),
    wiredep = require('wiredep').stream,
    clean = require('gulp-clean'),
    useref = require('gulp-useref'),
    gulpif = require('gulp-if'),
    uglify = require('gulp-uglify'),
    minifyCss = require('gulp-minify-css')


// Start local server
gulp.task('connect', function() {
  connect.server({
    root: 'app',
    livereload: true
  });
  opn('http://localhost:8080/');
});

// HTML
gulp.task('html', function () {
  gulp.src('./app/*.html')
    .pipe(connect.reload());
});

// CSS
gulp.task('css', function () {
  gulp.src('./app/css/*.css')
    .pipe(connect.reload());
});

// JS
gulp.task('js', function () {
  gulp.src('./app/js/*.js')
    .pipe(connect.reload());
});

// Wire Bower dependencies to your source code
gulp.task('wiredep', function () {
  gulp.src('app/*.html')
    .pipe(wiredep({
      directory : 'app/bower_components'
    }))
    .pipe(gulp.dest('app'));
});

// Watch
gulp.task('watch', function () {
  gulp.watch(['./app/*.html'], ['html']);
  gulp.watch(['./app/css/*.css'], ['css']);
  gulp.watch(['./app/js/*.js'], ['js']);
  gulp.watch(['bower.json'], ['wiredep']);
});

// Clean
gulp.task('clean', function () {
  return gulp.src('dist', {read: false})
    .pipe(clean());
});

// Build Dist
gulp.task('build', function () {
    var assets = useref.assets();
    return gulp.src('app/*.html')
        .pipe(assets)
        .pipe(gulpif('*.js', uglify()))
        .pipe(gulpif('*.css', minifyCss()))
        .pipe(assets.restore())
        .pipe(useref())
        .pipe(gulp.dest('dist'));
});

// Default
gulp.task('default', ['connect', 'watch']);