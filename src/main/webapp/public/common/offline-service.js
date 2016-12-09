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

    OfflineService.$inject = ['Offline'];

    function OfflineService(Offline) {
        this.isOffline = false;

        Offline.options = { reconnect: { initialDelay: 30, delay: 30 },
                            checkOnLoad: true,
                            interceptRequests: true
                          };

        Offline.on('confirmed-up', online);

        Offline.on('up', online);

        Offline.on('confirmed-down', offline);

        Offline.on('down', offline);

        function offline() {
            isOffline = true;
        };

        function online() {
            isOffline = false;
        };
    }
})();