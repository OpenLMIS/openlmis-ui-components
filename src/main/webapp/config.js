(function() {
    'use strict';

    angular.module('openlmis-config',[])
    .config(function($qProvider){
        $qProvider.errorOnUnhandledRejections(false);
    });

})();