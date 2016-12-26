(function() {
    'use strict';

    /**
     *
     * @ngdoc service
     * @name  openlmis-core.OfflineInterval
     * @description 
     * 
     * Checks if browser is offline at a predetermined interval by calling
     * OfflineService. Will immedately call OfflineService.checkConnection, 
     * then continually call checkConnection every 30 seconds.
     *
     */
    angular
        .module('openlmis-core')
        .run(checkOfflineInterval);

    checkOfflineInterval.$inject = ['OfflineService', '$timeout'];

    function checkOfflineInterval(OfflineService, $timeout){

        function checkConnectionDelay(){
            $timeout(function() {
                OfflineService.checkConnection()
                .finally(checkConnectionDelay);
            }, 30000);
        }

        OfflineService.checkConnection()
        .finally(checkConnectionDelay);
    }

})();