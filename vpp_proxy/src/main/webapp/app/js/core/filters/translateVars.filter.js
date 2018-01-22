(function() {
    'use strict';

    angular
        .module('vppca.core')
        .filter('translateVar', translateVar);

    function translateVar($log, $translate) {

        if ($translate.statefulFilter()) {
            translateVarFilter.$stateful = true;
        }

        return translateVarFilter;

        ////////////////

        /**
         * Since the original translate filter only works on variables that do not need to be translated,
         * use this filter when you need the variables to also be translated.
         * 
         * @param  {string} translationId     The tranlation key value
         * @param  {object} interpolateParams The variable injection argument, use {var: 'my.key'} for translated variables, {var: {text: 'My Text'}} for static text
         * @param  {boolean} interpolation     See original translate filter documentation
         * @param  {booleam} forceLanguage     See original translate filter documentation
         * @return {string}                   Translated value
         */
        function translateVarFilter(translationId, interpolateParams, interpolation, forceLanguage) {
        	var transInterpolateParams = {}, output;
            if (angular.isObject(interpolateParams)) {
    			angular.forEach(interpolateParams, function(value, key) {
    				if(angular.isObject(value) && value.text) {
    					transInterpolateParams[key] = value;
    				} else if(typeof value === 'string') {
    					transInterpolateParams[key] = $translate.instant(value);
    				}
    			});
    		}

            output = $translate.instant(translationId, transInterpolateParams, interpolation, forceLanguage);
            if(output === translationId) {
                $log.warn('translateVar: key <' + translationId + '> not found.', output);
                output = '';
            }
    		return output;
        }
    }

})();