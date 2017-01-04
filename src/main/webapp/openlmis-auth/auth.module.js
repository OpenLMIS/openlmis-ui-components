
 (function(){
    'use strict';

    /**
    *
    * @module openlmis-auth
    *
    * @description
    * The openlmis-auth module is responsible for logging a user in and out of the OpenLMIS-UI, and managing authentication when making calls to other services.
    *
    */

    angular.module('openlmis-auth', [
        'http-auth-interceptor',
        'openlmis-local-storage',
        'openlmis-modal',
        'openlmis-templates',
        'openlmis-urls',
        'openlmis-user',
        'ui.router'
        ]);

})();
