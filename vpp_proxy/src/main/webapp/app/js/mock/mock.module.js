(function() {
    'use strict';

    angular
        .module('mockE2E', [
        	'ngMockE2E',
            'vppca.core'
        ]);

    angular.module('mockE2E').config(config);
    angular.module('mockE2E').run(runApp);

    /*@ngInject*/
    function config($provide) {
        // delay mock backend responses
        $provide.decorator('$httpBackend', /*@ngInject*/ function ($delegate) {
            var proxy = function(method, url, data, callback, headers) {
                var interceptor = function() {
                    var _this = this, _arguments = arguments, delay = 100;
                    if(url.match(/^\/vppca/)) {
                        delay = Math.floor(Math.random() * 1800) + 200;
                    }
                    setTimeout(function() {
                        // return result to the client AFTER delay
                        callback.apply(_this, _arguments);
                    }, delay);
                };
                return $delegate.call(this, method, url, data, interceptor, headers);
            };
            for(var key in $delegate) {
                proxy[key] = $delegate[key];
            }
            return proxy;
        });
    }

    /*@ngInject*/
    function runApp($httpBackend, $log, mockData) {

        /*
            Define and intercept all backend calls. This allows us to simulate a backend application
            while developing our front-end. As the backend API is fleshed out, calls can be converted
            to '.passThrough()' to call the actual backend service, until this module is no longer
            needed. Responses can either be straight object responses, or a function that can analyze
            the passed data, and then return an array in the format: [HTML_STATUS_CODE, DATA, HEADERS]
         */

    	/**********   Core  *******************************************************************/

        //$httpBackend.whenGET(/^\/dto\/rest\/init\/key\//).respond(function(method, url) {
        //    $log.debug('DTOE2E: ', method, url);
        //    return generateResponse(initData.getInit(url));
       // });
        
        // $httpBackend.whenGET(/^\/private-offers\/rest\/dto\/init\//).respond(function(method, url) {
        // 	$log.debug('DTOE2E: ', method, url);
        //     return [200, buildResponse(initData.getInit(url)), {}];
        // }); 

        //$httpBackend.whenGET(/^\/dto\/rest\/dealers\//).respond(function(method, url) {
        //    $log.debug('DTOE2E: ', method, url);
        //    return [200, buildResponse(dealersData.getDealers()), {}];
        //});

        $httpBackend.whenGET(/^\/some\/rest\/service\//).respond(function(method, url) {
            $log.debug('MockE2E: ', method, url);
            return [200, buildResponse(mockData.getData(url)), {}];
        });


        /**********   Passthrough ************************************************************/

        //our view templates exist, so just pass the call to the browser
    	$httpBackend.whenGET(/\s*.html$/).passThrough();
    	$httpBackend.whenGET(/^\/agency/).passThrough();

        //$httpBackend.whenGET(/^\/some-working-service/).passThrough();
        //$httpBackend.whenPOST(/^\/some-working-service/).passThrough();
    }


    ////PRIVATE/////
    
    //build the common response from DRMP services, with the status and metadata blocks
    function buildResponse(resp) {
        var response = {};
        angular.extend(response, resp, {
            metadata: {
                respondedTime: new Date().getTime(),
                vppNode: 'vppMock001'
            },
            status: {
                responseCode: '0',
                responseMessage: 'Success'
            }
        });
        return response;
    }

    //handle the generic response codes base on the existance of errors in the mock response
    function generateResponse(data) {
        return [(data.errors && data.errors.length) ? 400 : 200, buildResponse(data), {}];
    }
})();