(function() {
    'use strict';

    angular
        .module('vppca.core')
        .directive('loyMatch', loyMatch);

    /* @ngInject */
    function loyMatch() {
        // Usage:
        //
        // Creates:
        //
        var directive = {
            require: 'ngModel',
            link: link,
            restrict: 'A'
        };

        return directive;

        function link(scope, element, attrs, ctrl) {
        	var validate = function(viewValue) {
        		var comparisonModel = attrs.loyMatch;

		        if(!viewValue || !comparisonModel){
		          // It's valid because we have nothing to compare against
		          ctrl.$setValidity('match', true);
		        }

		        else{
                   // It's valid if model is lower than the model we're comparing against
                  ctrl.$setValidity('match', viewValue.toUpperCase() === comparisonModel.toUpperCase() ); 
                }
		        return viewValue;

		    };

			ctrl.$parsers.unshift(validate);
			ctrl.$formatters.push(validate);

			attrs.$observe('loyMatch', function(comparisonModel){
				// Whenever the comparison model changes we'll re-validate
				return validate(ctrl.$viewValue);
			});
        }
    }
})();