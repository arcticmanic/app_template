"use strict"

var gulp = require('gulp'),
		connect = require('gulp-connect'),
		opn = require('opn'),
    wiredep = require('wiredep').stream,
    clean = require('gulp-clean'),
    useref = require('gulp-useref'),
    gulpif = require('gulp-if'),
    uglify = require('gulp-uglify'),
    minifyCss = require('gulp-minify-css'),
    sass = require('gulp-sass'),
    jade = require('jade'),
    gulpJade = require('gulp-jade'),
    notify = require("gulp-notify"),
    uncss = require('gulp-uncss'),
    rename = require('gulp-rename'),
    autoprefixer = require('gulp-autoprefixer')

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
gulp.task('watch', function (){
  gulp.watch(['./app/jade/*.jade'], ['jade']);
   gulp.watch(['./app/*.html'], ['html']);
  gulp.watch(['./app/scss/*.scss'], ['sass']);
  gulp.watch(['./app/css/*.css'], ['css','autoprefixer']);
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
        .pipe(gulp.dest('dist'))
        .pipe(notify({ message: 'Build dist!' }));
});

// Sass
gulp.task('sass', function () {
    gulp.src('app/scss/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('app/css'));
});

// Default
gulp.task('default', ['connect', 'watch']);

// Jade test-task
gulp.task('jade', function () {
  return gulp.src('./app/jade/*.jade')
    .pipe(gulpJade({
      jade: jade,
      pretty: true
    }))
    .pipe(gulp.dest('./app/'))
    .pipe(notify({ message: 'Jade task complete' }));
})

//Uncss test-task
gulp.task('uncss', function() {
    return gulp.src('./app/css/main.css')
        .pipe(uncss({
            html: ['http://site-spb.ru/']
        }))
        .pipe(gulp.dest('./out'));
});

// Rename Task
gulp.task('rename', function(){
  gulp.src('app/css/main.css')
  .pipe(rename('pretty_styles.css'))
  .pipe(gulp.dest('build/css/'));
});

// Notify Task
// gulp.task('notify', function(){
//   gulp.src('./app/css/main.css')
//   .pipe(notify('CSS File was changed!'));
// });

// Autoprefixer Task
gulp.task('autoprefixer', function(){
  gulp.src('app/css/*.css')
  .pipe(autoprefixer({
    browsers: ['last 3 versions']
  }))
  .pipe(gulp.dest('app/css'));
});