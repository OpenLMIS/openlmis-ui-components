(function() {
    "use strict";

    angular.module('openlmis-core')
        .factory('messageService', messageService);

    var LOCALE_STORAGE_KEY = 'current_locale',
    DEFAULT_LANGUAGE = 'en';

    messageService.$inject = ['$q', '$http', 'localStorageService', '$rootScope', '$resource'];
    function messageService($q, $http, localStorageService, $rootScope) {
        var service = {
            getCurrentLocale: getCurrentLocale,
            populate: populate,
            get: get
        };

        return service;

        function getCurrentLocale(){
            return localStorageService.get(LOCALE_STORAGE_KEY);
        }

        function populate (locale) {
            if(!locale) locale = DEFAULT_LANGUAGE;

            var deferred = $q.defer();
            $http({
                method:'GET',
                url:'messages/messages_' + locale + '.json'
            })
            .then(function(response) {
                var data = response.data;
                for (var attr in data) {
                    localStorageService.add('message.' + attr, data[attr]);
                }
                localStorageService.add(LOCALE_STORAGE_KEY, locale);
                $rootScope.$broadcast('openlmis.messages.populated');
                deferred.resolve();
            }, function() {
                $rootScope.$broadcast('openlmis.messages.error');
                deferred.reject();
            });
            return deferred.promise;
        };

        function get () {
            var keyWithArgs = Array.prototype.slice.call(arguments);
            var displayMessage = localStorageService.get('message.' + keyWithArgs[0]);
            if (keyWithArgs.length > 1 && displayMessage) {
                $.each(keyWithArgs, function(index, arg) {
                    if (index > 0) {
                        displayMessage = displayMessage.replace("{" + (index - 1) + "}", arg);
                    }
                });
            }
            return displayMessage || keyWithArgs[0];
        };
    }

})();
