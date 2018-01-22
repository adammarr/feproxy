var gulp = require('gulp');

var runSequence = require('run-sequence');

gulp.task('vendor:prod', function(callback) {
    runSequence('vendor:depend',
                'vendor:styles:prod',
                'vendor:scripts:prod',
                callback);
});