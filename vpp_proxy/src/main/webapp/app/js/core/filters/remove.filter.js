(function() {
    'use strict';

    angular
        .module('vppca.core')
        .filter('remove', remove);

    /* @ngInject */
    function remove() {

        return filter;

        ////////////////

        /**
         * Allows arrays to be filtered by removing objects from a matched remove list.
         * 
         * @param  {Array} obj        Original Array
         * @param  {Array} removeList Array of objects to filter from the original Array
         * @return {Array}            Filtered Array
         */
        function filter(obj, removeList) {
            var keepList = [],
			hasObj = false;
			removeList = removeList || [];
			
			if(obj && obj.length) {
				for(var i = 0; i < obj.length; i++) {
					for(var j = 0; j < removeList.length; j++) {
						if(angular.equals(obj[i], removeList[j])) {
							hasObj= true;
						}
					}
					if(!hasObj) {
						keepList.push(obj[i]);
					}
					hasObj = false;
				}
			}
	        return keepList;
        }
    }
})();