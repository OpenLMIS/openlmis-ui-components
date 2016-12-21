(function() {
    'use strict';

    angular
        .module('openlmis-core')
        .run(checkOfflineConnection);

    checkOfflineConnection.$inject = ['OfflineService'];

    function checkOfflineConnection(OfflineService){
        OfflineService.checkConnection();
    }

})();
