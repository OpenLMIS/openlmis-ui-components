(function() {

    'use strict';

    angular
        .module('openlmis-core')
        .factory('localStorageFactory', factory);

    factory.$inject = ['$localStorage'];
    function factory($localStorage) {

        return LocalStorageFactory;

        function LocalStorageFactory(resourceName) {
            var storage = {
                resource: resourceName,
                get: get,
                getAll: getAll,
                put: put,
                clearAll: clearAll
            };

            if (!$localStorage[resourceName]) {
                $localStorage[resourceName] = {};
            }

            return storage;
        }

        function get(id) {
            return $localStorage[this.resource][id];
        }

        function getAll() {
            var items = [];
            angular.forEach($localStorage[this.resource], function(item) {
                items.push(item);
            });
            return items;
        }

        function put(item) {
            return $localStorage[this.resource][item.id] = item;
        }

        function clearAll() {
            $localStorage[this.resource] = {};
        }


    }

})();
