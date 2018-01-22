var gulp = require('gulp');

var config = require('../../config').vendorCSS;

gulp.task('vendor:depend', function(cb) {
    if(config.dependencies) {
        for(var src in config.dependencies) {
            gulp.src(src).pipe(gulp.dest(config.dependencies[src]));
        }
    }
    cb();
});