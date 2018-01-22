var gulp = require('gulp');

var concat = require('gulp-concat');
var inject = require('gulp-inject');
var plumber = require('gulp-plumber');
var rename = require('gulp-rename');
var rev = require('gulp-rev');

var handleErrors = require('../../utils/handleErrors');
var config = require('../../config');

gulp.task('vendor:copy', function() {

    var jsfiles = gulp.src(config.vendorJS.src).pipe(gulp.dest('webapp/dist/vendor-js')),
        cssfiles = gulp.src(config.vendorCSS.src).pipe(gulp.dest('webapp/dist/vendor-css')),
        jsMaps = gulp.src(config.vendorJS.maps).pipe(gulp.dest('webapp/dist/vendor-js')),
        cssMaps = gulp.src(config.vendorCSS.maps).pipe(gulp.dest('webapp/dist/vendor-css'));

    return gulp.src('webapp/index.html')
        .pipe(plumber(handleErrors))
        .pipe(inject(jsfiles, {
            starttag: '<!-- bower:js -->',
            endtag: '<!-- endinject -->',
            addRootSlash: false,  // ensures proper relative paths
            ignorePath: '/webapp/' // ensures proper relative paths
        }))
        .pipe(inject(cssfiles, {
            starttag: '<!-- bower:css -->',
            endtag: '<!-- endinject -->',
            addRootSlash: false,  // ensures proper relative paths
            ignorePath: '/webapp/' // ensures proper relative paths
        }))
        .pipe(gulp.dest('./webapp/'));
});