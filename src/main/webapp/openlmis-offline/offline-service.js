(function(){
    "use strict";

    /**
     * @ngdoc service
     * @name openlmis-offline.offlineService
     * @description
     * Service allows to determine whether the browser can detect an internet connection.
     *
     */

    angular.module('openlmis-offline')
        .service('offlineService', offlineService);

    offlineService.$inject = ['Offline', '$timeout', '$q'];

    function offlineService(Offline, $timeout, $q) {
        var service = this,
            isOffline = false;

        Offline.options = {
            checkOnLoad: true,
            interceptRequests: false,
            requests: false,
            checks: {xhr: {
              url: function() {
                return 'favicon.ico?_=' + new Date().getTime();
              }
            }}
        };

        Offline.on('confirmed-up', online);

        Offline.on('up', online);

        Offline.on('confirmed-down', offline);

        Offline.on('down', offline);

        /**
         * @ngdoc function
         * @name checkConnection
         * @methodOf openlmis-offline.offlineService
         *
         * @description
         * Checks periodically if user is online or not.
         *
         */
        service.checkConnection = function() {
            var deferred = $q.defer();

            Offline.check();

            function confirmedOnline(){
                clearEvents();
                deferred.resolve();
            }
            function confirmedOffline(){
                clearEvents();
                deferred.reject();
            }
            function clearEvents(){
                Offline.off('confirmed-up', confirmedOnline);
                Offline.off('confirmed-down', confirmedOffline);
            }

            Offline.on('confirmed-up', confirmedOnline);
            Offline.on('confirmed-down', confirmedOffline);

            return deferred.promise;
        }

        /**
         * @ngdoc function
         * @name isOffline
         * @methodOf openlmis-offline.offlineService
         * @return {Boolean} true if user is offline
         *
         */
        service.isOffline = function() {
            return isOffline;
        }

        function offline() {
           $timeout(function() {
               isOffline = true;
           });
        }

        function online() {
           $timeout(function() {
               isOffline = false;
           });
        }
    }
})();
