var gulp = require('gulp');

var Server = require('karma').Server;
var config = require('../../config').test;

gulp.task('test', function (done) {
	new Server({
		configFile: __dirname + '/../../../' + config.src,
		singleRun: true
	}, done).start();
});