(function() {

    'use strict';

    angular
        .module('openlmis.requisitions')
        .service('RequisitionStorage', service);

    service.$inject = ['$localStorage'];

    function service($localStorage) {

        this.get = get;
        this.put = put;

        init();

        function get(id) {
            return $localStorage.requisitions[id];
        }

        function put(requisition) {
            return $localStorage.requisitions[requisition.id] = requisition;
        }

        function init() {
            if (!$localStorage.requisitions) {
                $localStorage.requisitions = {};
            }
        }

    }

})();
