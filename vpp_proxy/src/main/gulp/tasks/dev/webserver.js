var gulp = require('gulp'); 

var connect = require('gulp-connect');
var config = require('../../config').webserver;

gulp.task('webserver', function() {
	connect.server({
		livereload: true,
		port: config.port,
		root: config.root,
		fallback: config.fallback
	});
});