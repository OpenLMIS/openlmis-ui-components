(function() {

    'use strict';

    angular
        .module('openlmis.requisitions')
        .service('RequisitionStorage', service);

    service.$inject = ['$localStorage', '$q', '$filter'];

    function service($localStorage, $q, $filter) {

        this.get = get;
        this.put = put;
        this.getAll = getAll;
        this.search = search;
        this.clearAll = clearAll;

        init();

        function get(id) {
            return $localStorage.requisitions[id];
        }

        function getAll() {
            var requisitions = [];
            angular.forEach($localStorage.requisitions, function(requisition) {
                requisitions.push(requisition);
            });
            return requisitions;
        }

        function search(params) {
            return $filter('requisitionFilter')($localStorage.requisitions, params);
        }

        function put(requisition) {
            return $localStorage.requisitions[requisition.id] = requisition;
        }

        function clearAll() {
            $localStorage.requisitions = {};
        }

        function init() {
            if (!$localStorage.requisitions) {
                $localStorage.requisitions = {};
            }
        }
    }

})();
