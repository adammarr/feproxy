(function() {
    'use strict';

    angular
        .module('vppca.core')
        .controller('HomeCtrl', HomeCtrl);

    /* @ngInject */
    function HomeCtrl($log, $state) {
        /*jshint validthis: true */
        var vm = this;

        activate();


        ///// PRIVATE ////////////////////

        function activate() {
            $log.debug('HomeCtrl: home');
        }

    }
})();