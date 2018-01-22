(function() {
    'use strict';

    angular
        .module('vppca.core')
        .directive('translateHref', translateHref);

    /* @ngInject */
    function translateHref($rootScope, $log, $interpolate, $translate) {
        // Usage:
        //
        // Creates:
        //
        var directive = {
            link: link,
            restrict: 'A'
        };

        return directive;

        function link(scope, element, attrs) {

            function doTranslate() {
                $log.debug('translateHref: doTranslate');
                $translate(attrs.translateHref).then(function (value) {
                    $log.debug('translateHref: translated - ' + value);
                    if(value !== attrs.translateHref) {
                        var src = value;

                        if(attrs.interpolate) {
                            src = $interpolate(attrs.interpolate)({key: value});
                        }
                        attrs.$set('href', src);
                    }
                }, function (translationId) {
                    $log.warn('translateHref: translation missing or not yet loaded - ' + translationId);
                });
            }

            var transEvent = $rootScope.$on('$translateChangeSuccess', function () {
                doTranslate();
            });
            doTranslate();

            //clean up after ourselves
            scope.$on('$destroy', transEvent);

        }
    }
})();