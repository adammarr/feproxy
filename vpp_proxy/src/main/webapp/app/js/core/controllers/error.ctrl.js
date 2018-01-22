(function() {
    'use strict';

    angular
        .module('vppca.core')
        .controller('ErrorCtrl', ErrorCtrl);

    /* @ngInject */
    function ErrorCtrl($log, $stateParams, ErrorsService, StorageService) {
        var vm = this;

        vm.errResp = null;
        vm.errors = null;
        
        activate();

        ////////////////

        function activate() {
            vm.errResp = $stateParams.errResp;
            if(vm.errResp){
                vm.errResp = angular.fromJson(vm.errResp);

                
                ErrorsService.getErrors(vm.errResp,
                    {code : 'td.components.label.keyCode'},
                    null, false).then(function(errObj) {

                    vm.errors = errObj.system;
                });

                StorageService.sessionClearAll();
                StorageService.localClearAll();
            }
            $log.debug('ErrorCtrl: errResp - ', vm.errResp);
        }
    }
})();