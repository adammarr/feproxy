(function() {
    'use strict';

    angular
        .module('vppca.core')
        .filter('startFrom', startFrom);

    /* @ngInject */
    function startFrom() {

        return filter;

        ////////////////

        /**
         * Starts an iteration at a particular point in the array, for pagination
         * 
         * @param  {Array} input    The Array to repeat on
         * @param  {int} page     The page number to start at, 0 indexed
         * @param  {int} pageSize The size of the pages
         * @return {Array}          A copy of the array, starting at the correct index
         */
        function filter(input, page, pageSize) {
            page = parseInt(page) || 0;
	    	pageSize = parseInt(pageSize) || 0;
	        var start = page * pageSize;
	        if(input && typeof input.slice === 'function') {
	        	return input.slice(start);
	        }
        }
    }
})();