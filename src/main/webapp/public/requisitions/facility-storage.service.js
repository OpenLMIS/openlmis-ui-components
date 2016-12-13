(function() {

    'use strict';

    angular
        .module('openlmis.requisitions')
        .service('FacilityStorage', service);

    service.$inject = ['$localStorage'];

    function service($localStorage) {

        this.get = get;
        this.getAll = getAll;
        this.put = put;
        this.clearAll = clearAll;

        init();

        function get(id) {
            return $localStorage.facilities[id];
        }

        function getAll() {
            var facilities = [];
            angular.forEach($localStorage.facilities, function(facility) {
                facilities.push(facility);
            });
            return facilities;
        }

        function put(facility) {
            return $localStorage.facilities[facility.id] = facility;
        }

        function clearAll() {
            $localStorage.facilities = {};
        }

        function init() {
            if (!$localStorage.facilities) {
                $localStorage.facilities = {};
            }
        }
    }

})();
