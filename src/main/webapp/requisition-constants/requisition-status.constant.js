(function() {

    'use strict';

    angular
        .module('requisition-constants')
        .constant('REQUISITION_STATUS', status());

    function status() {

        return {
            INITIATED: 'INITIATED',
            SUBMITTED: 'SUBMITTED',
            AUTHORIZED: 'AUTHORIZED',
            IN_APPROVAL: 'IN_APPROVAL',
            APPROVED: 'APPROVED',
            RELEASED: 'RELEASED',
            SKIPPED: 'SKIPPED',
            $toList: toList
        };

        function toList() {
            var list = [],
                id = 0;
            angular.forEach(this, function(status) {
                if (!angular.isFunction(status)) {
                    list.push( {
                        id: id,
                        label: status
                    });
                    id++;
                }
            });
            return list;
        }
    }

})();
