(function() {
    'use strict';

    /*
        Basic http interceptor. Used to log error messages on request failures. Also
        increments the loading count, for displaying the loading backdrop when needed.
     */

    angular
        .module('vppca.core')
        .factory('authInterceptor', authInterceptor);

    /* @ngInject */
    function authInterceptor($q, $rootScope, $timeout, $log, loadingService, ErrorsService, constants) {
        var service = {
            request: request,
            requestError: requestError,
            response: response,
            responseError: responseError
        };

        activate();

        return service;

        ////////////////

        function request(config) {
            if(!ignoreURI(config.url)) {
                loadingService.addLoad();
            }
            return config;
        }
		
		function requestError(config) {
			loadingService.removeLoad();
		}
		
		function response(resp) {
            if(!ignoreURI(resp.config.url)) {
                loadingService.removeLoad();
            }
            return resp;
        }
		
		function responseError(response) {
            if(!ignoreURI(response.config.url)) {
                loadingService.removeLoad();
            }
            if(response.status === 400) {
                ErrorsService.getErrorMsg(response.data.errors, true);
                return $q.reject(response.data);
            } else if(response.status === 401) {
                $log.error('Response 401: Unauthorized', response);
          		return $q.reject(response.data);
        	} else if(response.status === 404) {
        		$log.error('Response 404: Not Found', response);
        	} else if(response.status === 412) {
        		$log.error('Response 412: No Access', response);
        	} else if(response.status === 422) {
                $log.error('Response 422: Data Validation Error', response);
                return $q.reject(response.data);
            } else if(response.status === 500) {
                $log.error('Response 500: Server Error', response);
                return $q.reject(response.data);
            } else {
            	$log.error('Response ' + response.status, response);
            }
        	return $q.reject({errors: { system: ['Response error: ' + response.status]}});
		}


        /////PRIVATE////
        
        function activate() {
        }

        /**
         * Look at the DTO constant for ignored URIs, and see if they match the current URI,
         * if so, the request shouldn't trigger the loading backdrop.
         * 
         * @param  {string} url The current request URI
         * @return {boolean}     If the URI matches the defined list
         */
        function handleURI(url) {
            for(var i = 0; i < constants.handleURILoading.length; i++) {
                if(constants.handleURILoading[i].reg.test(url)) {
                    return constants.handleURILoading[i];
                }
            }
            return;
        }

         /**
         * Look at the DTO constant for ignored URIs, and see if they match the current URI,
         * if so, the request shouldn't trigger the loading backdrop.
         * 
         * @param  {string} url The current request URI
         * @return {boolean}     If the URI matches the defined list
         */
        function ignoreURI(url) {
            var ignore = false;
            for(var i = 0; i < constants.handleURILoading.length; i++) {
                if(constants.handleURILoading[i].reg.test(url) && constants.handleURILoading[i].ignore) {
                    ignore = true;
                }
            }
            return ignore;
        }
    }
})();