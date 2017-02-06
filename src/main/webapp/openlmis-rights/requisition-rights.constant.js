(function() {

    'use strict';

    angular
        .module('openlmis-rights')
        .constant('REQUISITION_RIGHTS', constant());

    function constant() {
        return {
            REQUISITION_VIEW: 'REQUISITION_VIEW',
            REQUISITION_CREATE: 'REQUISITION_CREATE',
            REQUISITION_AUTHORIZE: 'REQUISITION_AUTHORIZE',
            REQUISITION_APPROVE: 'REQUISITION_APPROVE',
            REQUISITION_DELETE: 'REQUISITION_DELETE',
            REQUISITION_TEMPLATES_MANAGE: 'REQUISITION_TEMPLATES_MANAGE'
        };
    }

})();
