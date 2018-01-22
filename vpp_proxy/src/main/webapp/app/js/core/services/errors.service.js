(function() {
    'use strict';

    angular
        .module('vppca.core')
        .factory('ErrorsService', ErrorsService);

    /* @ngInject */
    function ErrorsService($interpolate, $q, $log, $translate) {
        var service = {
            makeFieldVars: makeFieldVars,
            getErrors: getErrors,
            getErrorMsg: getErrorMsg
        };

        return service;

        ////////////////
        
        function makeFieldVars(prefix, vars) {
            var ret = {}, i;
            if(vars && vars.length) {
                for(i = 0; i < vars.length; i++) {
                    ret[vars[i]] = (/[\s\d]*\.$/.test(prefix) ? prefix : (prefix + '.')) + vars[i];
                }
            }
            return ret;
        }

        /*
            Example: ErrorService.getErrors(serviceResp,
                                                { var1 : 'label.value1', var2: { text: 'My Value' }},
                                                { firstName : 'label.firstName', code: { text: 'My Code' }},
                                                true);

            This allows $translate variables to be passed as keys or as non-translated text. The final boolean
            putFieldErrsWithSystem will group the field errors along with the system errors array, if you plan
            on outputting all errors in one place. If you are putting the field errors separate, such as with
            the field itself, leave this off or pass it as false.

            The response will contain a boolean hasErrors, which will be false if there are no errors. fieldsRaw
            and systemRaw are the raw response error objects from the response. These are mapped by the field
            name as the key for fields and a plain Array for system. fields and system vars are for the
            translated text. Again, the fields object are mapped by the field name as key, where the system
            Array is simply an array of strings.

            The codes object is a map of codes, for example: { '9001' : true }. This allows the caller of
            this function an easy way to check for the presence of a particular error code.
         */
        function getErrors(resp, globalVars, fieldVars, putFieldErrsWithSystem) {
        	var errorObj = { hasErrors: false, fieldsRaw: {}, systemRaw: [], codes: {}, fields: {}, system: [] },
                defer = $q.defer(),
                promises = [],
                globalVarsTranslated = {},
                fieldVarsTranslated = {};
            fieldVars = fieldVars || {};

            //we need to first translate the variables, if they are key based, since this is promise driven,
            //the rest of the flow cannot occur until the promises for the vars are resolved.
            translateVars(globalVars, fieldVars).then(function(translatedVars) {
            	if(typeof resp === 'object' && resp.errors && resp.errors.length) {
                    errorObj.hasErrors = true;
            		for(var i = 0; i < resp.errors.length; i++) {
            			if(resp.errors[i].field) {
                            if(typeof errorObj.fieldsRaw[resp.errors[i].field] !== 'object') {
                                errorObj.fieldsRaw[resp.errors[i].field] = [];
                            }
                            errorObj.fieldsRaw[resp.errors[i].field].push(resp.errors[i]);
                            if(translatedVars.fieldVarsTranslated[resp.errors[i].field]) {
                                promises.push(setTranslation(errorObj.fields, resp.errors[i].errorCode, getMergeVars(translatedVars.globalVarsTranslated, translatedVars.fieldVarsTranslated, resp.errors[i].field), resp.errors[i].field));
                            } else {
                                promises.push(setTranslation(errorObj.fields, resp.errors[i].errorCode, translatedVars.globalVarsTranslated, resp.errors[i].field));
                            }
                        } else {
                            errorObj.systemRaw.push(resp.errors[i]);
                            promises.push(setTranslation(errorObj.system, resp.errors[i].errorCode, translatedVars.globalVarsTranslated));
                        }
                        errorObj.codes[resp.errors[i].errorCode] = true;
            		}
            	}
                $q.all(promises).then(function() {
                    if(putFieldErrsWithSystem) {
                        angular.forEach(errorObj.fields, function(value, key) {
                            if(angular.isArray(value)) {
                                 angular.forEach(value, function(val) {
                                    errorObj.system.push(val);
                                 });
                            } else {
                                errorObj.system.push(value);
                            }
                        });
                    }
                    defer.resolve(errorObj);
                });
            });

            return defer.promise;
        }

        function getErrorMsg(resp) {
            var msg;
        	if(typeof resp === 'object' && resp.errors && resp.errors.length) {
        		msg = getMessage(resp.errors[0]);
        		return msg;
        	}
        	return false;
        }

        ////PRIVATE///////////
        
        function getMessage(error) {
        	if(error && error.message) {
        		return error.message + ((error.field) ? (' : ' + error.field) : '');
        	}
        	return 'An unknown error occured';
        }

        function setTranslation(obj, key, vars, field) {
            return $translate('errors.' + key, vars).then(function(val) {
                if(angular.isArray(obj)) {
                    obj.push(val);
                } else if(angular.isObject(obj)) {
                    if(!obj[field]) {
                        obj[field] = [];
                    }
                    obj[field].push(val);
                }
            }, transFail);
        }

        /**
         * Translate the list of global and field variables.
         * 
         * @param  {object} globalVars Object Map of global variables
         * @param  {object} fieldVars  Object Map of field level variables
         * @return {object}            Object Map for translated global and field variables
         */
        function translateVars(globalVars, fieldVars) {
            var defer = $q.defer(),
                promises = [],
                resolve = {
                    globalVarsTranslated: {},
                    fieldVarsTranslated: {}
                };

            angular.forEach(globalVars, function(value, key) {
                $log.debug(key, value);
                if(typeof value === 'string') {
                    promises.push($translate(value).then(function(val) { resolve.globalVarsTranslated[key] = val; }, transFail));
                } else if (angular.isObject(value) && value.key) {
                    promises.push($translate(value.key).then(function(val) { resolve.globalVarsTranslated[key] = val; }, transFail));
                } else if (angular.isObject(value) && value.text) {
                    resolve.globalVarsTranslated[key] = val;
                }
            });

            angular.forEach(fieldVars, function(value, key) {
                if(typeof value === 'string') {
                    promises.push($translate(value).then(function(val) { resolve.fieldVarsTranslated[key] = val; }, transFail));
                } else if (angular.isObject(value) && value.key) {
                    promises.push($translate(value.key).then(function(val) { resolve.fieldVarsTranslated[key] = val; }, transFail));
                } else if (angular.isObject(value) && value.text) {
                    resolve.fieldVarsTranslated[key] = val;
                }
            });

            $q.all(promises).then(function() {
                defer.resolve(resolve);
            });
            return defer.promise;
        }

        /**
         * The $translate service uses only a single object for variables. This merges the global variables
         * and relevent field variables. The field variable is also added as "label" to the object, for
         * basic validation error messages.
         * 
         * @param  {object} globalVars The global variable map
         * @param  {object} fieldVars  The field variable map
         * @param  {string} field      The field name
         * @return {object}            The final merged variable injection object
         */
        function getMergeVars(globalVars, fieldVars, field) {
            //don't add "label" if its already there...
            if(fieldVars.label || globalVars.label) {
                return angular.merge({}, globalVars, (fieldVars[field]) ? fieldVars[field] : {});
            }
            return angular.merge({},
                            globalVars,
                            (fieldVars[field]) ? { label: fieldVars[field] } : {});
        }

        /**
         * Handle the translate error condition with a log output.
         *
         * @param  {string} val The message key of the failed translation
         * @return {void}
         */
        function transFail(val) {
            $log.error('ErrorsService: translation lookup failed: ' + val);
        }

        
    }
})();