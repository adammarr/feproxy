(function() {
    'use strict';

    angular
        .module('vppca.core')
        .factory('LangFactory', LangFactory);

    /* @ngInject */
    function LangFactory($log, $q, $translate, $translatePartialLoader) {
        var factory = func;

        var languages = {};
        
        return factory;

        ////////////////

        /**
         * This acts as the $translate loader. This allows us to act in a hybrid mode, where we can load languages from both predefined values, such as those returned from the program detail service, and the built-in partial loader JSON files.
         * @param  {object} options The loader options
         * @return {function | promise}         Function or promise, depending on the caller
         */
        function func(options) {
        	//if a normal service is calling this, return a function to register a new lang pack
        	if(options === undefined) {
        		return {
        			addLang : addLang,
                    hasKey: hasKey
        		};
        	}

        	var deferred = $q.defer();

        	if(languages[options.key]) {
        		$log.debug('LangFactory: resolved language: ' + options.key);
        		deferred.resolve(languages[options.key]);
        	} else {
	        	$log.debug('LangFactory: no custom lang packs found for: ' + options.key + ', fallback to $translatePartialLoader');
	        	return $translatePartialLoader(angular.extend({}, options, {
		        	urlTemplate: '/i18n/{part}/lang-{lang}.json'
		        }));
	        }
        	return deferred.promise;
        }

        /////// PRIVATE ////////////
        
        /**
         * Register a language pack, such as from program configuration
         * @param {string} key    The language key
         * @param {object} values The map of tranlations
         */
        function addLang(key, values) {
        	if(key && typeof values === 'object') {
        		$log.debug('LangFactory: Register language pack: ' + key);
	        	languages[key] = values;
	        	return true;
	        }
	        $log.error('LangFactory: Invalid values passed to addLang');
	        return false;
        }

        function hasKey(key) {
            return $translate(key) !== key;
        }
    }
})();