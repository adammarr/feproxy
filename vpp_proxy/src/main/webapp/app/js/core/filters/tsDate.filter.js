(function() {
    'use strict';

    angular
        .module('vppca.core')
        .filter('tsDate', tsDate);

    /* @ngInject */
    function tsDate() {

        return filter;

        ////////////////

        function filter(ts, includetime) {
            if(ts) {
                var formatStr = 'MM/DD/YYYY';
                
                
                if(includetime) {
                    formatStr += ' ' + 'hh:mm';
                }
                return moment(ts).format(formatStr);
            }
            return '';
        }
    }
})();