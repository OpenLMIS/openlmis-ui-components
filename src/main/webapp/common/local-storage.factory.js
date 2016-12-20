(function() {

    'use strict';

    angular
        .module('openlmis-core')
        .factory('localStorageFactory', factory);

    factory.$inject = ['localStorageService', '$filter'];

    function factory(localStorageService, $filter) {
        var resources = {};

        return LocalStorageFactory;

        function LocalStorageFactory(resourceName) {
            if (resources[resourceName]) {
                return resources[resourceName];
            }

            var items = getFromStorage(resourceName);
            if (!items) {
                items = [];
            }

            var resource = {
                put: put,
                getBy: getBy,
                getAll: getAll,
                search: search,
                removeBy: removeBy,
                clearAll: clearAll,
                contains: contains
            };
            resources[resourceName] = resource;
            return resource;

            function put(object) {
                executeWithStorageUpdate(function() {
                    if (object.id) {
                        removeItemBy('id', object.id);
                    }
                    items.push(copy(object));
                });
            }

            function getBy(property, value) {
                var filtered = searchItems(toParams(property, value));
                return filtered.length ? copy(filtered[0]) : undefined;
            }

            function getAll() {
                return copyList(items);
            }

            function search(params, filter) {
                return copyList(searchItems(params, filter));
            }

            function removeBy(property, value) {
                executeWithStorageUpdate(function() {
                    removeItemBy(property, value);
                });
            }

            function clearAll() {
                executeWithStorageUpdate(function() {
                    items.splice(0,items.length);
                });
            }

            function contains(object) {
                return items.indexOf(object) !== -1;
            }

            function removeItemBy(property, value) {
                var filtered = searchItems(toParams(property, value));
                if (filtered.length) {
                    items.splice(items.indexOf(filtered[0]), 1);
                }
            }

            function searchItems(params, filter) {
                return $filter(filter ? filter : 'filter')(items, params);
            }

            function toParams(property, value) {
                var params = {};
                params[property] = value;
                return params;
            }

            function executeWithStorageUpdate(functionToExecute) {
                functionToExecute();
                updateStorage(resourceName, items);
            }
        }

        function getFromStorage(key) {
            var json = localStorageService.get(key);
            return json ? angular.fromJson(json) : undefined;
        }

        function updateStorage(key, data) {
            localStorageService.add(key, angular.toJson(data));
        }

        function copy(object) {
            return angular.extend({}, object);
        }

        function copyList(list) {
            var copiedList = [];
            list.forEach(function(item) {
                copiedList.push(copy(item));
            });
            return copiedList;
        }
    }
})();
