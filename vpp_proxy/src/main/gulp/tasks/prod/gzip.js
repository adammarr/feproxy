var gulp = require('gulp');

var plumber = require('gulp-plumber');
var gzip = require('gulp-gzip');

var handleErrors = require('../../utils/handleErrors');
var config = require('../../config').gzip;

gulp.task('gzip', function() {

    return gulp.src(config.src)
        .pipe(plumber({errorHandler: handleErrors}))
        .pipe(gzip({skipGrowingFiles: true}))
        .pipe(gulp.dest('./site'));
});