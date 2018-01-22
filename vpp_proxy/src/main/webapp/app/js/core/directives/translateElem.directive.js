(function() {
    'use strict';

    angular
        .module('vppca.core')
        .directive('translateElem', translateElem);

    /* @ngInject */
    function translateElem($rootScope) {
        // Usage:
        //
        // Creates:
        //
        var directive = {
            bindToController: true,
            controller: Controller,
            controllerAs: 'vm',
            link: link,
            replace: true,
            template: '<ng-bind-html ng-bind-html="vm.elOutput">',
            restrict: 'E',
            scope: {
            	key: '@',
            	type: '@',
                alt: '@',
                width: '@',
                height: '@',
                maxWidth: '@',
                interpolate: '@'
            }
        };

        return directive;

        function link(scope, element, attrs) {
        }
    }

    /* @ngInject */
    function Controller($rootScope, $scope, $log, $interpolate, $translate) {

    	var vm = this;

    	vm.elOutput = '';

        activate();


        /// PRIVATE /////////////

        function doTranslate() {
            $translate(vm.key).then(function (value) {
                $log.debug('translateElem: translation loaded - ' + vm.key);
                if(value !== vm.key) {
                    var src;
                    if(vm.type === 'img') {
                        var alt = (vm.alt) ? (' alt="' + $translate.instant(vm.alt) + '"') : '',
                            width = (vm.width) ? (' width="' + $translate.instant(vm.width) + '"') : '',
                            maxWidth = (vm.maxWidth) ? (' max-width="' + $translate.instant(vm.maxWidth) + '"') : '',
                            height = (vm.height) ? (' height="' + $translate.instant(vm.height) + '"') : '';
                        src = value;
                        if(vm.interpolate) {
                            src = $interpolate(vm.interpolate)({key: value});
                        }
                        vm.elOutput = '<img src="' + src + '"' + alt + width + maxWidth + height + '/>';
                    } else if(vm.type === 'link') {
                        src = value;
                        if(vm.interpolate) {
                            src = $interpolate(vm.interpolate)({key: value});
                        }
                        vm.elOutput = '<link rel="stylesheet" href="' + src + '">';
                    }
                }
            }, function (translationId) {
                $log.warn('translateElem: translation missing or not yet loaded - ' + translationId);
            });
        }

        function activate() {
            var transEvent = $rootScope.$on('$translateChangeSuccess', function () {
                doTranslate();
            });
            doTranslate();

            //clean up after ourselves
            $scope.$on('$destroy', transEvent);
        }
    }
})();