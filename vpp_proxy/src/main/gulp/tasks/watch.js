var gulp = require('gulp');

var runSequence = require('run-sequence');

var config = require('../config');


// Watch Files For Changes
gulp.task('watch', function() {
    gulp.watch(config.scripts.src, function() {
    	runSequence(['lint', 'logwarn'],
                'debug:dev',
                'scripts');
    });
    gulp.watch(config.scss.src, function() {
    	runSequence('clean:styles',
                'styles');
    });
});