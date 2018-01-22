var gulp = require('gulp');

var beautify = require('gulp-beautify');
var plumber = require('gulp-plumber');

var handleErrors = require('../../utils/handleErrors');
var config = require('../../config').scripts;

gulp.task('pretty:js', function() {

    return gulp.src(config.src)
        .pipe(plumber({errorHandler: handleErrors}))
        .pipe(beautify())
    	.pipe(gulp.dest('webapp/app/js'));
});