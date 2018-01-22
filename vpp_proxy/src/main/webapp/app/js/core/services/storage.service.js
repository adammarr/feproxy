(function() {
    'use strict';

    /*
        Store values in the session or local storage. Since angular maintains the state in the
        browser, and only during the single page instance, the application must protect it's
        state somehow. Storing values in session-storage allows the state to be protected
        across page-refreshes. Local storage allows for longer term storage, if needed.
     */

    angular
        .module('vppca.core')
        .factory('StorageService', StorageService);

    /* @ngInject */
    function StorageService($log, $window) {

        var service = {
            sessionAdd: sessionAdd,
            sessionGet: sessionGet,
            sessionClear: sessionClear,
            sessionClearAll : sessionClearAll,
            localAdd: localAdd,
            localGet: localGet,
            localClear: localClear,
            localClearAll : localClearAll
        };

        var hasStorage = ('sessionStorage' in $window);
        $log.debug('StorageService: hasStorage: ' + hasStorage);

        return service;

        ////////////////////

        function sessionAdd(key, value) {
        	addItem('sessionStorage', key, value);
        }

        function sessionGet(key, defaultValue) {
        	return getItem('sessionStorage', key, defaultValue);
        }

        function sessionClear(key) {
        	removeItem('sessionStorage', key);
        }

        function sessionClearAll(){
            clearAll('sessionStorage');
        }

        function localAdd(key, value) {
        	addItem('localStorage', key, value);
        }

        function localGet(key, defaultValue) {
        	return getItem('localStorage', key, defaultValue);
        }

        function localClear(key) {
        	removeItem('localStorage', key);
        }

        function localClearAll(){
            clearAll('localStorage');
        }

        ///// PRIVATE //////////
        
        function addItem(type, key, value) {
        	if(hasStorage && value !== undefined && value !== null) {
        		$window[type].setItem(key, value);
        	}
        }

        function getItem(type, key, defaultValue) {
        	var i;
        	if(hasStorage) {
        		i = $window[type].getItem(key);
        	}
    		if(i === undefined || i === null) {
    			i = defaultValue;
    		}
        	return i;
        }

        function removeItem(type, key) {
        	if(hasStorage) {
        		if(key) {
        			$window[type].removeItem(key);
        		} else {
        			var itemKeys = [], i;
        			for(i in $window[type]) {
        				itemKeys.push(i);
        			}
        			for(i = 0; i < itemKeys.length; i++) {
        				$window[type].removeItem(itemKeys[i]);
        			}
        		}
        	}
        }

        function clearAll(type){
            $window[type].clear();
        }
    }
})();