(function() {
    'use strict';

    angular
        .module('vppca.core')
        .directive('mask', mask);

    /* @ngInject */
    function mask() {
        /*
        	Create input that uses the digitalbush jquery mask input plugin.
        	See: http://digitalbush.com/projects/masked-input-plugin/

			Add mask-placeholder attribute if you wish to use a placeholder
			different than "space".
         */
        var directive = {
            link: link,
            restrict: 'A'
        };

        return directive;

        function link(scope, element, attrs) {
        	if(element.mask) {
        		element.mask(attrs.mask, { placeholder: attrs.maskPlaceholder || ' ' });
        	}
        }
    }
})();