(function() {

    'use strict';

    angular
        .module('order')
        .constant('ORDER_STATUS', status());

    function status() {

        return {
            ORDERED: 'ORDERED',
            IN_TRANSIT: 'IN_TRANSIT',
            PICKING: 'PICKING',
            PICKED: 'PICKED',
            SHIPPED: 'SHIPPED',
            RECEIVED: 'RECEIVED',
            TRANSFER_FAILED: 'TRANSFER_FAILED',
            IN_ROUTE: 'IN_ROUTE',
            READY_TO_PACK: 'READY_TO_PACK'
        };
    }

})();
