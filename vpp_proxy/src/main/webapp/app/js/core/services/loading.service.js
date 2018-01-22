(function() {
    'use strict';

    /*
        Used to maintain a count of the number of open backend requests. Based on this count
        the front-end will display or hide the loading screen.
     */

    angular
        .module('vppca.core')
        .factory('loadingService', loadingService);

    /* @ngInject */
    function loadingService($log) {
        var service = {
            loadText: null,
            count: 0,
            addLoad: addLoad,
            removeLoad: removeLoad,
            addTrack: addTrack,
            removeTrack: removeTrack
        };

        var tracked = [];

        return service;

        ////////////////

        function addLoad() {
			service.count += 1;
		}
		
		function removeLoad() {
			service.count -= 1;
		}

        function addTrack(title) {
            for(var i = 0; i < tracked.length; i++) {
                //don't track dups and double submits
                if(tracked[i].title === title) {
                    return;
                }
            }
            tracked.push({
                title: title,
                time: new Date().getTime()
            });
        }

        function removeTrack(title) {
            var idx, time;
            for(var i = 0; i < tracked.length; i++) {
                if(tracked[i].title === title) {
                    time =  new Date().getTime() - tracked[i].time;
                    $log.debug('loadingService: time tracked - ' + tracked[i].title + ' : ' + time);
                    ga('send', 'timing', tracked[i].title, 'load', time);
                }
            }
            //remove the item
            tracked.splice(idx, 1);
        }
    }
})();