(function() {

    'use strict';

    angular
        .module('openlmis-rights')
        .constant('FULFILLMENT_RIGHTS', rights());

    function rights() {
        return {
            ORDERS_VIEW: 'ORDERS_VIEW',
            PODS_MANAGE: 'PODS_MANAGE'
        };
    }

})();
