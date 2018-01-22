var gulp = require('gulp');

var inject = require('gulp-inject');
var plumber = require('gulp-plumber');

var handleErrors = require('../../utils/handleErrors');
var config = require('../../config').scripts;

gulp.task('scripts', function() {

    var jsfiles = gulp.src(config.src);

    return gulp.src('webapp/index.html')
        .pipe(plumber({errorHandler: handleErrors}))
        .pipe(inject(jsfiles, {
            starttag: '<!-- app:js -->',
            endtag: '<!-- endinject -->',
            addRootSlash: false,  // ensures proper relative paths
            ignorePath: '/webapp/' // ensures proper relative paths
        }))
        .pipe(gulp.dest('./webapp/'));
});