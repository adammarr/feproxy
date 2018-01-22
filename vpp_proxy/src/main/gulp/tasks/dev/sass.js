var gulp = require('gulp');

var autoprefixer = require('gulp-autoprefixer');
var plumber = require('gulp-plumber');
var rev = require('gulp-rev');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');

var handleErrors = require('../../utils/handleErrors');
var config = require('../../config').scss;

gulp.task('sass', function() {

    return gulp.src(config.src)
        .pipe(plumber({errorHandler: handleErrors}))
        .pipe(sourcemaps.init())
        .pipe(sass()).on('error', sass.logError)
        .pipe(autoprefixer())
        .pipe(rev())
        .pipe(sourcemaps.write('maps'))
        .pipe(gulp.dest('webapp/dist/css'));
});