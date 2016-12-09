(function(){
    "use strict";

    /**
        *
        * @ngdoc service
        * @name openlmis-core.OfflineService
        * @description
        * Service allows to determine whether the browser can detect an internet connection.
        *
        */

    angular.module('openlmis-core')
        .service('OfflineService', OfflineService);

    OfflineService.$inject = ['Offline', '$q'];

    function OfflineService(Offline, $q) {
        var isOffline = false;

        //Reconnect: should Offline.js retest connection periodically when it is down
        //Requests: should Offline.js store and attempt to remake requests which fail while the
        //connection is down
        Offline.options = {reconnect: false, requests: false};

       /**
            *
            * @ngdoc function
            * @name isOffline
            * @methodOf openlmis-core.OfflineService
            *
            * @description
            * Determines whether the browser can detect an internet connection.
            *
            */
        function isOffline() {
            var deferred = $q.defer();

            var offline = function() {
                deferred.resolve(true);
                unbindEvents();
                isOffline = true;
            }

            var online = function() {
                deferred.resolve(false);
                unbindEvents();
                isOffline = false;
            }

            var unbindEvents = function() {
                Offline.off('confirmed-up', online);
                Offline.off('confirmed-down', offline);
            }

            Offline.on('confirmed-up', online);
            Offline.on('confirmed-down', offline);
            Offline.check();

            return deferred.promise;
        };

        return {
            isOffline: isOffline
        }
    }
})();