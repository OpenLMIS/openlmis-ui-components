(function() {
    'use strict';

    /**
     *
     * @ngdoc service
     * @name  openlmis-offline.OfflineInterval
     * @description 
     * 
     * Checks if browser is offline at a predetermined interval by calling
     * offlineService. Will immedately call offlineService.checkConnection, 
     * then continually call checkConnection every 30 seconds.
     *
     */
    angular
        .module('openlmis-offline')
        .run(checkOfflineInterval);

    checkOfflineInterval.$inject = ['offlineService', '$timeout'];

    function checkOfflineInterval(offlineService, $timeout){

        function checkConnectionDelay(){
            $timeout(function() {
                offlineService.checkConnection()
                .finally(checkConnectionDelay);
            }, 30000);
        }

        offlineService.checkConnection()
        .finally(checkConnectionDelay);
    }

})();