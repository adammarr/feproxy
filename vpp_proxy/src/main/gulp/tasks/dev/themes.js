var gulp = require('gulp');

var autoprefixer = require('gulp-autoprefixer');
var debug = require('gulp-debug');
var merge = require('merge-stream');
var plumber = require('gulp-plumber');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');

var handleErrors = require('../../utils/handleErrors');
var config = require('../../config').scss;

gulp.task('sass:themes', function() {

    var stream = merge();

    for(var i = 0; i < config.themes.length; i++) {
        stream.add(gulp.src(config.themes[i].file)
            .pipe(debug({title: 'SCSSTHEME:'}))
            .pipe(plumber({errorHandler: handleErrors}))
            .pipe(sourcemaps.init())
            .pipe(sass()).on('error', sass.logError)
            .pipe(autoprefixer())
            .pipe(sourcemaps.write('maps'))
            .pipe(gulp.dest('webapp/dist/css/themes')));
    }

    return stream;
});