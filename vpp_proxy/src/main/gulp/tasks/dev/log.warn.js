var gulp = require('gulp');

var logwarn = require('gulp-logwarn');

var config = require('../../config').scripts;

gulp.task('logwarn', function(){
    return gulp.src(config.src)
        .pipe(logwarn(['console.debug', 'console.log', 'alert(', 'confirm('], {
            logLevel: 'warn'
        }));
});