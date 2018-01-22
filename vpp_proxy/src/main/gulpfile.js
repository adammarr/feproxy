var requireDir = require('require-dir');

// Require all tasks in gulp/tasks, including subfolders
requireDir('./gulp/tasks', { recurse: true });

/*
Basic Commands:
gulp build			production build
gulp build:dev		local development build
gulp watch			local development watch (js/scss changes)
 */