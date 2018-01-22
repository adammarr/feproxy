(function() {
    'use strict';

    angular
        .module('vppca.core')
        .factory('userService', userService);

    /* @ngInject */
    function userService($log, $rootScope, $q, $timeout, $urlRouter, $state, constants, UserModel) {
        var service = {
        	user: {},
        	nav: {},
        	access: {},
        	permissionList: [],
        	loggedin: false,
            logout: logout,
            hasPermission: hasPermission,
            login: login,
            initialize: initialize
        };

        var initialized = false;

        activate();

        return service;

        ////////////////
		
		function logout() {
			removeUser();
			UserModel.logout();
		}
		
		function hasPermission(permission) {
			return (service.permissionList.indexOf(permission) > -1);
		}


		function login(username, password) {
			var defer = $q.defer();

			UserModel.login({
				username: username,
				password: password
			}, function(response) {
				$log.debug('UserService: login response:', response);
				if(response.accountID) {
					UserModel.get({id: response.accountID}, function(cust) {
						$log.debug('UserService: customer response:', cust);
						setUser(cust);
						defer.resolve(cust);
					});
				}
			}, function(response) {
				$log.debug('UserService: login failure response:', response);
				defer.resolve(response);
			});
			return defer.promise;
		}

		function initialize(username, password) {
			return fetchUser(username, password);
		}

		///////PRIVATE////
		
		function activate() {
			
		}

		function removeUser() {
			service.user = {};
			service.nav = {};
			service.access = {};
			service.loggedin = false;
			service.permissionList = [];
		}

        function setUser(user) {
			service.user = user;
			service.loggedin = true;
			mapPermissions();
		}

        //map user permissions and navigation menus
		function mapPermissions() {
			var nav = {}, permissionList = [];
			for(var permission in service.access.permissions) {
				if(inRole(service.access.permissions[permission])) {
					permissionList.push(permission);
				}
			}
			service.permissionList = permissionList;
			service.nav = nav;
		}

		function inRole(roleArr) {
			for(var i = 0; i < service.user.roles.length; i++) {
				if(roleArr.indexOf(service.user.roles[i].name) > -1) {
					return true;
				}
			}
			return false;
		}

		function pruneNav(menu) {
			var nav = [];
			for(var i = 0; i < menu.length; i++) {
				if(service.hasPermission(menu[i].action)) {
					nav.push(menu[i]);
				}
			}
			return nav;
		}
    }
})();