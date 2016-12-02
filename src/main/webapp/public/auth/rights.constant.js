(function() {

    'use strict';

    angular
        .module('openlmis-auth')
        .constant('Rights', rights());

    function rights() {
        return {
            REQUISITION_VIEW: 'REQUISITION_VIEW',
            REQUISITION_CREATE: 'REQUISITION_CREATE',
            REQUISITION_AUTHORIZE: 'REQUISITION_AUTHORIZE',
            REQUISITION_APPROVE: 'REQUISITION_APPROVE',
            REQUISITION_DELETE: 'REQUISITION_DELETE'
        };
    }

})();
