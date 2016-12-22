(function() {
    'use strict';

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