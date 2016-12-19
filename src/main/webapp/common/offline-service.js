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

    OfflineService.$inject = ['Offline', '$timeout'];

    function OfflineService(Offline, $timeout) {
        var service = this,
            isOffline = false;

        Offline.options = {
            checkOnLoad: true,
            interceptRequests: false,
            requests: false,
            checks: {xhr: {url: 'favicon.ico'}}
            };

        Offline.on('confirmed-up', online);

        Offline.on('up', online);

        Offline.on('confirmed-down', offline);

        Offline.on('down', offline);

        service.checkConnection = function() {
            $timeout(function() {
                Offline.check();
                service.checkConnection();
            }, 30000);
        }

        service.checkConnection();

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