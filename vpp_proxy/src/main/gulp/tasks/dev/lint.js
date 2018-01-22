var gulp = require('gulp');

var jshint = require('gulp-jshint');
var notify = require('gulp-notify');
var plumber = require('gulp-plumber');
var stylish = require('jshint-stylish');

var handleErrors = require('../../utils/handleErrors');
var config = require('../../config').scripts;


// Lint Task
gulp.task('lint', function() {

    return gulp.src(config.src)
        .pipe(plumber({errorHandler: handleErrors}))
        .pipe(jshint())
        .pipe(jshint.reporter(stylish));
});