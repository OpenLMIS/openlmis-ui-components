(function() {
  
    'use strict';

    angular
        .module('openlmis.requisitions')
        .constant('Status', status());

    function status() {

        return {
            INITIATED: 'INITIATED',
            SUBMITTED: 'SUBMITTED',
            AUTHORIZED: 'AUTHORIZED',
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