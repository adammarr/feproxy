var gulp = require('gulp');

var inject = require('gulp-inject');
var plumber = require('gulp-plumber');

var handleErrors = require('../../utils/handleErrors');
var config = require('../../config').debug;

gulp.task('debug:prod', function() {

    var jsfiles = gulp.src(config.prod);

    return gulp.src('site/index.html')
        .pipe(plumber({errorHandler: handleErrors}))
        .pipe(inject(jsfiles, {
            starttag: '/** debug:js */',
            endtag: '/** endinject */',
            transform: function (filePath, file) {
                // return file contents as string
                return file.contents.toString('utf8')
            }
        }))
        .pipe(gulp.dest('./site/'));
});