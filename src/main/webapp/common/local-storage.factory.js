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
                    get: get,
                    getAll: getAll,
                    put: put,
                    clearAll: clearAll
                };

            if (!$localStorage[resourceName]) {
                $localStorage[resourceName] = {};
            }

            return storage;

            function get(id) {
                return angular.copy($localStorage[resourceName][id]);
            }

            function getAll() {
                var items = [];
                angular.forEach($localStorage[resourceName], function(item) {
                    items.push(angular.copy(item));
                });
                return items;
            }

            function put(item) {
                var index;
                if(!item.id) index = generateIndex();
                else index = item.id;
                $localStorage[resourceName][index] = item;
                return index;
            }

            function clearAll() {
                $localStorage[resourceName] = {};
            }

            function generateIndex() {
                var index;
                do {
                    index = Math.random();
                }
                while($localStorage[resourceName][index]);
                return index;
            }
        }
    }
})();
