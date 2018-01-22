var gulp = require('gulp');

var runSequence = require('run-sequence');

gulp.task('vendor', function(callback) {
    runSequence('vendor:depend',
                'vendor:copy',
                callback);
});