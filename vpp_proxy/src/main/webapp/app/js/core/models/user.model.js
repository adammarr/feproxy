(function() {
    'use strict';

    angular
        .module('vppca.core')
        .factory('UserModel', UserModel);

    /* @ngInject */
    function UserModel($resource, constants) {
        var service = $resource('vpprs/rest/customer/:id', { id: '@id' }, {
        		login: {
        			method: 'POST',
                    url: 'vpprs/rest/login/:site',
        			params: { site: constants.siteCode }
        		},
                logout: {
                    method: 'GET',
                    url: 'vpprs/rest/login/logout'
                }
		    });

        return service;
    }
})();