(function() {
    'use strict';

    angular
        .module('vppca.core')
        .filter('zipCode', zipCode);

    /* @ngInject */
    function zipCode() {

        return filter;


        function filter(postalCode) {
		    if (!postalCode) {
		        return postalCode;
		    }
		    if (postalCode.toString().length === 9) {
		       return postalCode.toString().slice(0, 5) + "-" + postalCode.toString().slice(5);
		    } else if (postalCode.toString().length === 5) {
		       return postalCode.toString();
		    } else {
		       return postalCode;
		    }
        }
    }
})();