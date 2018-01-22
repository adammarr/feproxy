(function() {
    'use strict';

    angular
        .module('vppca.core')
        .controller('LoginCtrl', LoginCtrl);

    /* @ngInject */
    function LoginCtrl($log, userService, ErrorsService) {
    	/*jshint validthis: true */
        var vm = this;

        vm.input = {};
        vm.errors = null;

        vm.doLogin = doLogin;

        activate();

        ////////////////
        
        function doLogin() {
        	userService.login(vm.input.email, vm.input.password).then(function(data) {
        		ErrorsService.getErrors(data, {}, ErrorsService.makeFieldVars('vppca.components.label', ['email', 'password'])).then(function(errors) {
        			$log.debug('LoginCtrl: errors response: ', errors);
        			if(errors.hasErrors) {
        				vm.errors = errors;
        			} else {

        			}
        		});
        	});
        }


        ///PRIVATE////////////

        function activate() {
        }
    }
})();