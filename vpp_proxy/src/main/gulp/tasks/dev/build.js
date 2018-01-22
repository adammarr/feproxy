var gulp = require('gulp');

var runSequence = require('run-sequence');

gulp.task('build:dev', function(callback) {
	runSequence('clean',
        'lint',
        'debug:dev',
		'scripts',
		'styles',
        'vendor',
		callback);
});