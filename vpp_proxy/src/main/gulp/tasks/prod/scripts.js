var gulp = require('gulp');

var concat = require('gulp-concat');
var gulpIgnore = require('gulp-ignore');
var inject = require('gulp-inject');
var ngAnnotate = require('gulp-ng-annotate');
var plumber = require('gulp-plumber');
var rename = require('gulp-rename');
var rev = require('gulp-rev');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');

var debug = require('gulp-debug');

var handleErrors = require('../../utils/handleErrors');
var config = require('../../config').scripts;

gulp.task('scripts:prod', function() {

    var jsfiles =  gulp.src(config.src)
        .pipe(plumber({errorHandler: handleErrors}))
        .pipe(ngAnnotate())
        .pipe(sourcemaps.init())
        .pipe(concat(config.concat))
        .pipe(gulp.dest('site/dist'))
        .pipe(rename(config.min))
        .pipe(uglify())
        .pipe(rev())
        .pipe(sourcemaps.write('maps'))
        .pipe(gulp.dest('site/dist'));

    return gulp.src('site/index.html')
        .pipe(plumber({errorHandler: handleErrors}))
        .pipe(inject(jsfiles.pipe(gulpIgnore.exclude('**/*.map')), {
            starttag: '<!-- app:js -->',
            endtag: '<!-- endinject -->',
            addRootSlash: false,  // ensures proper relative paths
            ignorePath: '/site/' // ensures proper relative paths
        }))
        .pipe(gulp.dest('./site/'));
});