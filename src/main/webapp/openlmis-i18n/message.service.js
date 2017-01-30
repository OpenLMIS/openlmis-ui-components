(function() {

    'use strict';

    angular
        .module('openlmis-i18n')
        .factory('messageService', messageService);

    var LOCALE_STORAGE_KEY = 'current_locale',
        DEFAULT_LANGUAGE = 'en';

    messageService.$inject = ['$q', '$http', 'localStorageService', '$rootScope', 'OPENLMIS_MESSAGES'];

    function messageService($q, $http, localStorageService, $rootScope, OPENLMIS_MESSAGES) {
        var currentLocale = DEFAULT_LANGUAGE;

        var service = {
            getCurrentLocale: getCurrentLocale,
            populate: populate,
            get: get
        };

        return service;

        function getCurrentLocale() {
            return currentLocale;
        }

        function populate (locale) {
            if(!locale) locale = DEFAULT_LANGUAGE;

            var deferred = $q.defer();
            if(OPENLMIS_MESSAGES[locale]){
                currentLocale = locale;
                $rootScope.$broadcast('openlmis.messages.populated');
                return $q.when();
            } else {
                $rootScope.$broadcast('openlmis.messages.error');
                return $q.reject();
            }
        };

        function get () {
            var keyWithArgs = Array.prototype.slice.call(arguments);
            var displayMessage = keyWithArgs[0];
            if(OPENLMIS_MESSAGES[currentLocale] && OPENLMIS_MESSAGES[currentLocale][keyWithArgs[0]]){
                displayMessage = OPENLMIS_MESSAGES[currentLocale][keyWithArgs[0]]
            }
            return displayMessage;
        };
    }

})();
