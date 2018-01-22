(function() {
    'use strict';

    angular
        .module('vppca.core')
        .factory('InitService', InitService);

    /* @ngInject */
    function InitService($log, $rootScope, $state, $translate, LangFactory, StorageService, ErrorsService) {
        var service = {
            routeInit: routeInit,
            pageInit: pageInit,
            registerInitRouter: registerInitRouter,
            getInitDetails: getInitDetails,
            switchLang: switchLang,
            setTemplateParams: setTemplateParams,
            setFooterParams: setFooterParams,
            getTemplateKey: getTemplateKey,
            getTemplatePromise: getTemplatePromise,
            getFooterKey: getFooterKey,
            getFooterPromise: getFooterPromise
        };

        var initRouters = [];

        var initializeDetails,
            langFallbacks = [],
            defaultLang = 'en',
            currentLang = defaultLang,
            languages = {
                'en': true
            },
            templateKey,
            templatePromise,
            footerKey = "default",
            footerPromise,
            templateDefault = 'templateA',
            footerDefault = "default",
            errorStates = [
                '9111', //One auth per session
                '9112', //Payload or cookie error
                '9113', //Offer or Program Error
                '9114', //Amount required/invalid
                '9115', //Key invalid
                '9116', //Key expired
                '9117' //Key cap reached

            ];

        activate();

        return service;

        ///////////////////////////

        /**
         * Initialize the service state and route the user to the next $state required.
         * 
         * @param  {object} initDetails The program detail response
         * @param  {object} options     Any passed options
         * @return {void}
         */
        function routeInit(initDetails, options) {
            StorageService.sessionAdd('InitService.initDetails', angular.toJson(initDetails));
            var state = getState(initDetails, options);
            initializeDetails = initDetails;
            initialize();

            if (state) {
                $log.debug('InitService: state found: ', state);
                $state.go(state.state, state.data);
            } else {
                $log.error('InitService: Could not locate a valid router state');
                $state.go('error', {
                    code: 'unknown'
                });
            }
        }

        /**
         * Initializes the program details on page refresh, by trying to load them from sessions storage.
         * @return {void}
         */
        function pageInit() {
            var details = StorageService.sessionGet('InitService.initDetails');
            if (details) {
                initializeDetails = angular.fromJson(details);
            }
            currentLang = StorageService.localGet('InitService.currentLang', defaultLang);
            if (initializeDetails) {
                $log.debug('InitService: loaded initDetails from storage: ', initializeDetails);
                initialize();
            } else {
                switchLang(currentLang);
            }
        }

        /**
         * Register a module router. This function should take the program details object,
         * and be able to inspect it to determine if it's module can handle it, and if so,
         * the $state required to direct the user to.
         * 
         * @param  {Function} fn The router function
         * @return {void}
         */
        function registerInitRouter(fn) {
            if (typeof fn === 'function') {
                initRouters.push(fn);
            }
        }

        
        /**
         * Switch the user's main language. Called initially to setup the main language and fallbacks.
         * This allows programs and campaigns to override the default values.
         * 
         * @param  {string} lang The lang to switch to, or nothing if we should use the default lang
         * @return {void}
         */
        function switchLang(lang) {
            var i,
                langKey,
                useProgLang,
                useLang = lang || currentLang;

            if (lang && languages[lang]) {
                currentLang = lang;
            }
            $log.debug('InitService: saving currentLang to storage: ' + currentLang);
            StorageService.localAdd('InitService.currentLang', currentLang);
            langFallbacks.push(defaultLang);
            if (defaultLang !== currentLang) {
                langFallbacks.push(currentLang);
            }
            
            //Add additional langFallbacks here, and set the userLang value as needed

            $log.debug('InitService: Register fallbacks: ', langFallbacks);
            $log.debug('InitService: Use language: ' + useLang);
            $translate.fallbackLanguage(langFallbacks);
            $translate.use(useLang);
        }

        function getInitDetails() {
            return initializeDetails;
        }

        
        function getTemplateKey() {
            return templateKey;
        }

        function getTemplatePromise() {
            return templatePromise;
        }

        function getFooterKey() {
            return footerKey;
        }

        function getFooterPromise() {
            return footerPromise;
        }

        function setTemplateParams() {
            //translate and set the initial site template key
            templatePromise = $translate('resources.siteTemplate').then(function(key) {
                templateKey = key;
            }, function(translationId) {
                templateKey = templateDefault;
            });

            //templateKey can potentially change anytime a new langpack is loaded
            $rootScope.$on('$translateChangeSuccess', function() {
                $translate('resources.siteTemplate').then(function(key) {
                    templateKey = key;
                }, function(translationId) {
                    templateKey = templateDefault;
                });
            });

        }

        function setFooterParams() {
            //translate and set the initial footer path key
            footerPromise = $translate('resources.footer').then(function(key) {
                footerKey = key;
            }, function(translationId) {
                footerKey = footerDefault;
            });

            //templateKey can potentially change anytime a new langpack is loaded
            $rootScope.$on('$translateChangeSuccess', function() {
                $translate('resources.footer').then(function(key) {
                    footerKey = key;
                    $rootScope.footerTemplate = footerKey;
                    $log.debug("Footer Key:", footerKey);
                }, function(translationId) {
                    footerKey = footerDefault;
                    $log.debug("Footer Key default:", footerKey);
                });
            });
            $rootScope.footerTemplate = footerKey;
            $log.debug("Footer Template:", $rootScope.footerTemplate);
        }

        ///// PRIVATE /////////////

        function activate() {
            
            setTemplateParams();
            setFooterParams();
        }

        function initialize() {
            
            setupProgramLang(initializeDetails);
            switchLang();
        }


        
        /**
         * Add the program language packs to the current translate object. These will override the default packs.
         * 
         * @param  {object} initDetails The program details response
         * @return {void}
         */
        function setupProgramLang(initDetails) {
            /* //Sample Code:
            var l,
                langKey,
                langs;

            LangFactory().addLang(langKey, langs[l]); //Add a language json (langs[]) with the key langKey
            $translate.use(langKey); //load the lang, switchLang() will handle the real setting
            */
        }

        /**
         * Iterate through the registered routers, and try and find a matching state to go to.
         * 
         * @param  {object} initDetails The program details response
         * @param  {object} options     Any passed options to pass to the router
         * @return {string}             $state to transition to
         */
        function getState(initDetails, options) {
            var state, errors, i;

            //check for generic DTO errors
            errors = ErrorsService.getErrors(initDetails);
            if (errors.hasErrors) {
                for (i = 0; i < errorStates.length; i++) {
                    if (errors.codes[errorStates[i]]) {
                        return {
                            state: 'error',
                            data: {
                                code: errorStates[i]
                            }
                        };
                    }
                }
            }

            //check for routes from registered modules
            for (i = 0; i < initRouters.length; i++) {
                state = initRouters[i].call(window, initDetails, options);
                if (state) {
                    return {
                        state: state
                    };
                }
            }
        }


    }
})();