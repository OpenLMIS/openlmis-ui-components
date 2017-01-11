(function() {

    'use strict';

    angular
        .module('requisition-constants')
        .constant('REQUISITION_RIGHTS', constant());

    function constant() {
        return {
            REQUISITION_VIEW: 'REQUISITION_VIEW',
            REQUISITION_CREATE: 'REQUISITION_CREATE',
            REQUISITION_AUTHORIZE: 'REQUISITION_AUTHORIZE',
            REQUISITION_APPROVE: 'REQUISITION_APPROVE',
            REQUISITION_DELETE: 'REQUISITION_DELETE',
            REQUISITION_CONVERT_TO_ORDER: 'REQUISITION_CONVERT_TO_ORDER',
            MANAGE_REQUISITION_TEMPLATES: 'MANAGE_REQUISITION_TEMPLATES'
        };
    }

})();
