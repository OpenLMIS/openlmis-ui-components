(function() {

    'use strict';

    angular
        .module('openlmis-rights')
        .constant('FULFILLMENT_RIGHTS', rights());

    function rights() {
        return {
            ORDERS_EDIT: 'ORDERS_EDIT',
            ORDERS_VIEW: 'ORDERS_VIEW',
            PODS_MANAGE: 'PODS_MANAGE'
        };
    }

})();
