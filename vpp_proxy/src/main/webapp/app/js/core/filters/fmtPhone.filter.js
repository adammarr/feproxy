(function() {
    'use strict';

    angular
        .module('vppca.core')
        .filter('fmtPhone', fmtPhone);

    /* @ngInject */
    function fmtPhone() {

        return filter;

        function filter(phoneNumber) {

            if (!phoneNumber) {
                return '';
            }


            //  phoneNumber = phoneNumber.toString().trim().replace(/^\+/, '');

            if (phoneNumber.match(/[^0-9]/)) {
                return phoneNumber;
            }

            if (phoneNumber.length === 10) {
                phoneNumber = "(" + phoneNumber.slice(0, 3) + ")" + phoneNumber.slice(3, 6) + "-" + phoneNumber.slice(6, 10);
            }
            return phoneNumber;

        }
    }
})();