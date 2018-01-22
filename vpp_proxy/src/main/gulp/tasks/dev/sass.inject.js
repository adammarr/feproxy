var gulp = require('gulp');

var inject = require('gulp-inject');
var plumber = require('gulp-plumber');

var handleErrors = require('../../utils/handleErrors');

gulp.task('sass:inject', function() {

    return gulp.src('webapp/index.html')
        .pipe(plumber({errorHandler: handleErrors}))
        .pipe(inject(gulp.src('webapp/dist/css/*.css'), {
            starttag: '<!-- app:css -->',
            endtag: '<!-- endinject -->',
            addRootSlash: false,  // ensures proper relative paths
            ignorePath: '/webapp/' // ensures proper relative paths
        }))
        .pipe(gulp.dest('./webapp/'));
});