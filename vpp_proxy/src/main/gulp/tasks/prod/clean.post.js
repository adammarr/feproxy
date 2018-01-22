var gulp = require('gulp');

var del = require('del');

var config = require('../../config').clean;


gulp.task('clean:post', function() {
    return del(config.post);
});