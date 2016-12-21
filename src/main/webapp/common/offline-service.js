(function(){
    "use strict";

    /**
     * @ngdoc service
     * @name openlmis-core.OfflineService
     * @description
     * Service allows to determine whether the browser can detect an internet connection.
     *
     */
    
    var checkConnectionInterval = 30000;

    angular.module('openlmis-core')
        .service('OfflineService', OfflineService);

    OfflineService.$inject = ['Offline', '$timeout'];

    function OfflineService(Offline, $timeout) {
        var service = this,
            isOffline = true; // Default to offline first

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
         * @methodOf openlmis-core.OfflineService
         *
         * @description
         * Checks periodically if user is online or not.
         *
         */
        service.checkConnection = function() {
            Offline.check();
            $timeout(service.checkConnection, checkConnectionInterval);
        }

        /**
         * @ngdoc function
         * @name isOffline
         * @methodOf openlmis-core.OfflineService
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