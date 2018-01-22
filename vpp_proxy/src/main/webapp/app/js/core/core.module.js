/* global toastr:false, moment:false */
(function() {
    'use strict';

    angular
        .module('vppca.core', [
            'ngResource',
            'ngSanitize',
            'ngAnimate',
            'ui.router',
            'ui.bootstrap',
            'ui.mask',
            'pascalprecht.translate',
            'angulartics',
            'angulartics.google.analytics',
            'ngMessages'
        ]);

    angular.module('vppca.core').config(configure);
    angular.module('vppca.core').run(runApp);

    
    angular.module('vppca.core').constant('moment', moment);
    angular.module('vppca.core').constant('constants', getConstants());

    /*@ngInject*/
    function configure($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider, $translateProvider, $translatePartialLoaderProvider, $analyticsProvider, $logProvider) {


        $stateProvider
            .state('home', {
                url: '/ajs/home',
                templateUrl: 'app/js/core/views/home.html',
                controller: 'HomeCtrl as home',
                onEnter: /*@ngInject*/ function($rootScope) {
                    $rootScope.pageTitle = 'vppca.page.title.home';
                }
            })
            .state('error-unknown', {
                url: '/ajs/error/unknown',
                templateUrl: 'app/js/core/views/error-unknown.html',
                controller: 'ErrorCtrl as error',
                onEnter: /*@ngInject*/ function($rootScope) {
                    $rootScope.pageTitle = 'vppca.page.title.error.unknown';
                }
            })
            .state('login', {
                url: '/ajs/login',
                templateUrl: 'app/js/core/views/login.html',
                controller: 'LoginCtrl as login',
                onEnter: /*@ngInject*/ function($rootScope) {
                    $rootScope.pageTitle = 'vppca.page.title.login';
                }
            });

        //The "Home" Page
        $urlRouterProvider.otherwise('/ajs/home');

        
        //setup the translate service
        $translatePartialLoaderProvider.addPart('core');
        $translatePartialLoaderProvider.addPart('errors');
        $translateProvider.useLoader('LangFactory');
        $translateProvider.preferredLanguage('en');
        $translateProvider.useLoaderCache(true);
        $translateProvider.useSanitizeValueStrategy('sanitizeParameters');

        //log should be disabled in staging and production
        if (window.ngDebugEnabled !== false || hasDebugFlag()) {
            $logProvider.debugEnabled(true);
        } else {
            $logProvider.debugEnabled(false);
        }
        $locationProvider.html5Mode(true);
        $httpProvider.interceptors.push('authInterceptor');

        // disable IE ajax request caching
        $httpProvider.defaults.cache = false;
        if (!$httpProvider.defaults.headers.get) {
            $httpProvider.defaults.headers.get = {};
        }
        $httpProvider.defaults.headers.get['If-Modified-Since'] = '0';

        
        //analytics configuration
        $analyticsProvider.trackExceptions(true);
    }

    //Although $state is not used below, it cannot be removed, as injecting it here kickstarts the ui-router
    /*@ngInject*/
    function runApp($rootScope, $state, $log, $window, loadingService, LangFactory, $translate, InitService) {

        
        $rootScope.langService = LangFactory();
        $rootScope.loadingService = loadingService;

        //so we can display certain header/footer sections based on current state
        $rootScope.$state = $state;

        //prevent default drag-drop behavior
        $(document).on('drop dragover', function(e) {
            e.preventDefault();
        });

        $rootScope.scrollTop = function() {
            $window.scrollTo(0, 0);
        };

        
        //Refresh translations whenever a partial is loaded
        $rootScope.$on('$translatePartialLoaderStructureChanged', function() {
            $translate.refresh();
        });

        $log.debug('core.module: running InitService.pageInit()');
        //Initialize any saved state from storage;
        InitService.pageInit();

        $rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error) {
            $log.error(arguments);
        });
    }

    function getConstants() {
        return {
            siteCode: 'cgpca',

            //input masks
            masks: {
                name: '(?![^,]*,[^,]*,)\\x20?(?:[a-zA-Z\'-]+\\x20?)*',
                address: '(?!.*  )[a-zA-Z\\d#()+\'.,/\\- ]{1,50}',
                city: '[a-zA-Z\\s]*',
                zip: '[0-9]{5}',
                phone: /\([1-9]{1}[0-9]{2}\)[0-9]{3}-[0-9]{4}/,
                email: /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i
            },

            //ignore: (boolean) do not show the loading backdrop on these Regex URI matches
            //track: (string) track the load times for these urls under the given category
            handleURILoading: [{
                reg: /rest\/cities\//,
                ignore: false
            }, {
                reg: /locator\/rest\/rewards/,
                track: 'Rewards List',
                ignore: false
            }]
        };
    }

    function hasDebugFlag() {
        return !!window.location.href.match(/(\?|&)debug/);
    }

})();