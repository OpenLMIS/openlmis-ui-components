(function() {

    'use strict';

    angular
        .module('openlmis.requisitions')
        .constant('RequisitionRights', constant());

    function constant() {
        return {
            REQUISITION_VIEW: 'REQUISITION_VIEW',
            REQUISITION_CREATE: 'REQUISITION_CREATE',
            REQUISITION_AUTHORIZE: 'REQUISITION_AUTHORIZE',
            REQUISITION_APPROVE: 'REQUISITION_APPROVE',
            REQUISITION_DELETE: 'REQUISITION_DELETE',
            MANAGE_REQUISITION_TEMPLATES: 'MANAGE_REQUISITION_TEMPLATES'
        };
    }

})();
