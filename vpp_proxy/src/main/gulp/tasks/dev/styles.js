var gulp = require('gulp');

var runSequence = require('run-sequence');

// Compile Our Sass
gulp.task('styles', function(callback) {
    runSequence('sass',
                'sass:inject',
                callback);
});