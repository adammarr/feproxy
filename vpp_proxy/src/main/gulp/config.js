module.exports = {
	clean: {
		src: ['webapp/dist/css/*',
		    'webapp/dist/css/themes/*',
		    'webapp/dist/vender-js',
		    'webapp/dist/vendor-css',
		    'webapp/dist/vendor/*',
		    'webapp/dist/vppca.*',
		    'webapp/dist/vppca-*.min.js',
		    'webapp/dist/maps/*',
		    'webapp/**/*.gz'
		],
		styles: ['webapp/dist/css/*'],
		post: ['webapp/dist/*.temp.*', 'webapp/dist/**/*.temp.*']
	},
	vendorJS: {
		src:  [
	        'node_modules/@bower_components/jquery/dist/jquery.min.js',
	        'node_modules/@bower_components/jquery.maskedinput/dist/jquery.maskedinput.min.js',
	        'node_modules/@bower_components/angular/angular.min.js',
	        'node_modules/@bower_components/angular-sanitize/angular-sanitize.min.js',
	        'node_modules/@bower_components/angular-resource/angular-resource.min.js',
	        'node_modules/@bower_components/angular-animate/angular-animate.min.js',
	        'node_modules/@bower_components/angular-messages/angular-messages.min.js',
	        'node_modules/@bower_components/angular-ui-router/release/angular-ui-router.min.js',
			'node_modules/@bower_components/bootstrap/dist/js/bootstrap.min.js',
	        'node_modules/@bower_components/angular-bootstrap/ui-bootstrap.min.js',
	        'node_modules/@bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js',
	        'node_modules/@bower_components/angular-fontawesome/dist/angular-fontawesome.min.js',
	        'node_modules/angular-translate/dist/angular-translate.min.js',
	        'node_modules/angular-translate/dist/angular-translate-storage-local/angular-translate-storage-local.min.js',
	        'node_modules/angular-translate/dist/angular-translate-loader-partial/angular-translate-loader-partial.min.js',
	        'node_modules/@bower_components/angulartics/dist/angulartics.min.js',
	        'node_modules/@bower_components/angulartics-google-analytics/dist/angulartics-ga.min.js',
	        'node_modules/@bower_components/moment/min/moment.min.js',
	        'node_modules/@bower_components/angular-ui-mask/dist/mask.min.js',
	        'node_modules/ua-parser-js/dist/ua-parser.min.js',
	        'node_modules/@bower_components/angular-mocks/angular-mocks.js'
	    ],
	    maps: [
	        'bower_components/angular/angular.min.js.map',
	        'bower_components/angular-sanitize/angular-sanitize.min.js.map',
	        'bower_components/angular-resource/angular-resource.min.js.map',
	        'bower_components/angular-animate/angular-animate.min.js.map',
	        'bower_components/angular-messages/angular-messages.min.js.map',
	        'bower_components/angulartics-google-analytics/dist/angulartics-ga.min.js.map'
	    ]
	},
	vendorCSS: {
		src:  [
	        'bower_components/bootstrap/dist/css/bootstrap.min.css',
	        'bower_components/bootstrap/dist/css/bootstrap-theme.min.css',
	        'bower_components/font-awesome/css/font-awesome.min.css'
	    ],
	    maps: [
	        'bower_components/bootstrap/dist/css/bootstrap.min.css.map',
	        'bower_components/bootstrap/dist/css/bootstrap-theme.min.css.map',
	        'bower_components/font-awesome/css/font-awesome.css.map'
	    ],
	    dependencies: {
	        'bower_components/bootstrap/fonts/**' : 'webapp/dist/fonts',
	        'bower_components/font-awesome/fonts/**' : 'webapp/dist/fonts'
	    }
	},
	scripts: {
		src: [
	        'webapp/app/js/vppca.js',
	        'webapp/app/js/core/core.module.js',
	        'webapp/app/js/**/core/*.module.js',
	        'webapp/app/js/**/*.module.js',
	        'webapp/app/js/**/*.js',
	        '!webapp/app/js/**/*.spec.js',
	        '!webapp/app/js/{mock,mock/**}'
	    ],
	    concat: 'vppca.temp.js',
	    min: 'vppca.min.js'
	},
    scss: {
    	src: [
	        'webapp/app/scss/main.scss',
	        'webapp/app/scss/partials/*.scss'
	    ],
	    themes: [
	    ],
    	themesWatch: [
	    ]
	},
	debug: {
		dev: 'webapp/app/debug/dev.js',
		prod: 'webapp/app/debug/prod.js'
	},
	webserver: {
		root: ['./webapp', './'],
		fallback: './webapp/index.html',
		port: 9090
	},
	test: {
		src: 'karma.conf.js'
	},
	gzip: {
		src: 'webapp/**/*.{html,json,css,js}'
	}
}