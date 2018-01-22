(function() {
    'use strict';

    angular
        .module('vppca.core')
        .factory('DeviceService', DeviceService);

    /* @ngInject */
    function DeviceService($log, $window) {
        var service = {
            getDeviceDetails: getDeviceDetails
        };

        return service;

        ////////////////

        function getDeviceDetails() {
        	var device = {};
        	
        	if(typeof UAParser === 'function') {
	        	var parser = (new UAParser()).getResult();
	        	device.ua = {
	        		browser: parser.browser.name,
	        		browserVer: parser.browser.major,
	        		browserVerFull: parser.browser.version,
	        		device: parser.device.type,
	        		deviceModel: parser.device.model,
	        		deviceVendor: parser.device.vendor,
	        		os: parser.os.name,
					osVer: parser.os.version
	        	};
	        }
	        if(typeof WURFL === 'object') {
	        	device.wurfl = {
	        		isMobile: WURFL.is_mobile,
	        		deviceName: WURFL.complete_device_name,
	        		type: WURFL.form_factor
	        	};
	        }
	        if($window.screen) {
	        	device.width = $window.screen.width;
	        	device.height = $window.screen.height;
	        	if($window.screen.orientation) {
		        	device.angle = $window.screen.orientation.angle;
		        	device.orientation = $window.screen.orientation.type;
		        }
	        }
	        $log.debug('DeviceService: device info: ', device);
	        return device;
        }
    }
})();