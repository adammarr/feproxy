var gulp = require('gulp');

var concat = require('gulp-concat');
var inject = require('gulp-inject');
var plumber = require('gulp-plumber');
var rename = require('gulp-rename');
var rev = require('gulp-rev');

var handleErrors = require('../../utils/handleErrors');
var config = require('../../config').vendorJS;

gulp.task('vendor:scripts:prod', function() {

    var jsfiles = gulp.src(config.src)
            .pipe(concat('vendor.temp.js'))
            .pipe(gulp.dest('site/dist/vendor'))
            .pipe(rename('vendor.min.js'))
            .pipe(rev())
            .pipe(gulp.dest('site/dist/vendor'));

    return gulp.src('site/index.html')
        .pipe(plumber({errorHandler: handleErrors}))
        .pipe(inject(jsfiles, {
            starttag: '<!-- bower:js -->',
            endtag: '<!-- endinject -->',
            addRootSlash: false,  // ensures proper relative paths
            ignorePath: '/site/' // ensures proper relative paths
        }))
        .pipe(gulp.dest('./site/'));
});