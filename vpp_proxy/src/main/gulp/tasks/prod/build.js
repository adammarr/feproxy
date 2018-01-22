var gulp = require('gulp');

var runSequence = require('run-sequence');

gulp.task('build:prod', function(callback) {
	runSequence('clean',
		'debug:prod',
		'scripts:prod',
		'styles',
		'vendor:prod',
		'clean:post',
		'gzip',
		callback);
});