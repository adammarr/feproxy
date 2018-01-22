(function() {
    'use strict';

    angular
        .module('mockE2E')
        .factory('mockData', mockData);

    /* @ngInject */
    function mockData() {
        var service = {
            getData: getData
        };

        var data = [{"id":0,"city":"Abingdon, VA"},{"id":1,"city":"Accomac, VA"}];

        return service;

        ///////////////////////

        function getData(url) {
        	return data[Math.floor(Math.random() * data.length)];
        }
    }
})();