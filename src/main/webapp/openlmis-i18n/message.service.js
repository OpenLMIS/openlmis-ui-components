(function() {

    'use strict';

    angular
        .module('openlmis-i18n')
        .factory('messageService', messageService);

    var DEFAULT_LANGUAGE = 'en';

    messageService.$inject = ['$q', '$rootScope', 'OPENLMIS_MESSAGES'];

    function messageService($q, $rootScope, OPENLMIS_MESSAGES) {
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
                return $q.reject();
            }
        };

        function get () {
            var keyWithArgs = Array.prototype.slice.call(arguments);
            var displayMessage = keyWithArgs[0];
            var parameters = keyWithArgs[1];
            if(OPENLMIS_MESSAGES[currentLocale] && OPENLMIS_MESSAGES[currentLocale][keyWithArgs[0]]){
                displayMessage = OPENLMIS_MESSAGES[currentLocale][keyWithArgs[0]]
            }
            if (parameters) {
                displayMessage = displayMessage.replace(/\$\{([\s]*[^;\s\{]+[\s]*)\}/g, function(_, match){
                    return parameters[match.trim()];
                });
            }
            return displayMessage;
        };
    }

})();
