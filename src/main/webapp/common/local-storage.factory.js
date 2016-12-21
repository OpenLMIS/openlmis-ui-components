(function() {

    'use strict';

    /**
     * @ngdoc service
     * @name openlmis.openlmis-core.localStorageFactory
     *
     * @description
     * It stores objects in browser cache to make them accessible offline.
     * Each stored or retrieved object is copied, so
     */
    angular
        .module('openlmis-core')
        .factory('localStorageFactory', factory);

    factory.$inject = ['localStorageService', '$filter'];

    function factory(localStorageService, $filter) {
        var resources = {};

        return LocalStorageFactory;

        /**
         * @ngdoc function
         * @name LocalStorageFactory
         * @methodOf openlmis.openlmis-core.localStorageFactory
         *
         * @description
         * Creates array in local storage that is named with resourceName.
         * It retruns object with methods to operate on this resource.
         *
         * @param {String} resourceName Name of resource to be stored
         * @returns {Object} Object with methods to save/get resource objects
         */
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
                remove: remove,
                removeBy: removeBy,
                clearAll: clearAll,
                contains: contains
            };
            resources[resourceName] = resource;
            return resource;

            /**
             * @ngdoc function
             * @name put
             * @methodOf openlmis.openlmis-core.localStorageFactory
             *
             * @description
             * Stores given object in local storage.
             *
             * @param {Object} object Object to store
             */
            function put(item) {
                if (item && !contains(item)) {
                    executeWithStorageUpdate(function() {
                        if (item.id) {
                            removeItemBy('id', item.id);
                        }
                        items.push(typeof item === 'object' ? angular.copy(item) : item);
                    });
                }
            }

            /**
             * @ngdoc function
             * @name getBy
             * @methodOf openlmis.openlmis-core.localStorageFactory
             *
             * @description
             * It searches for all objects that given property value is equal
             * and returns first from the list. If there is no results method returns undefined.
             *
             * @param {String} property Name of object property to be compared
             * @param {Object} value Value of proprty (equals found object property value)
             * @returns {Object} First found object with equal proprty value
             */
            function getBy(property, value) {
                var filtered = searchItems(toParams(property, value));
                return filtered.length ? angular.copy(filtered[0]) : undefined;
            }

            /**
             * @ngdoc function
             * @name getAll
             * @methodOf openlmis.openlmis-core.localStorageFactory
             *
             * @description
             * Method returns all resource objects stored in local storage.
             *
             * @returns {Array} All objects stored in this resource
             */
            function getAll() {
                return angular.copy(items);
            }

            /**
             * @ngdoc function
             * @name search
             * @methodOf openlmis.openlmis-core.localStorageFactory
             *
             * @description
             * It takes params and passes it to filter. If filter name is
             * not defined the default filter will be used.
             *
             * @param {Object} params Criteria passed to filter
             * @param {String} filter Name of the filter(optional)
             * @returns {Array} Filtered objects
             */
            function search(params, filter) {
                return angular.copy(searchItems(params, filter));
            }

            function remove(item) {
                executeWithStorageUpdate(function() {
                    removeItem(item);
                })
            }

            /**
             * @ngdoc function
             * @name getBy
             * @methodOf openlmis.openlmis-core.localStorageFactory
             *
             * @description
             * It searches for all objects that given property value is equal
             * and removes first from the list. If there is no results method returns undefined.
             *
             * @param {String} property Name of object property to be compared
             * @param {Object} value Value of proprty (equals found object property value)
             */
            function removeBy(property, value) {
                executeWithStorageUpdate(function() {
                    removeItemBy(property, value);
                });
            }

            /**
             * @ngdoc function
             * @name clearAll
             * @methodOf openlmis.openlmis-core.localStorageFactory
             *
             * @description
             * Removes all items from resource.
             */
            function clearAll() {
                executeWithStorageUpdate(function() {
                    items.splice(0,items.length);
                });
            }

            /**
             * @ngdoc function
             * @name contains
             * @methodOf openlmis.openlmis-core.localStorageFactory
             *
             * @description
             * Check if exactly same object exist in storage and if so
             * returns true, otherwise false.
             *
             * @param {Object} object Object to compare
             * @returns {Boolean} if objects exista in storage
             */
            function contains(object) {
                return items.indexOf(object) !== -1;
            }

            function removeItem(item) {
                items.splice(items.indexOf(item), 1);
            }

            function removeItemBy(property, value) {
                var filtered = searchItems(toParams(property, value));
                if (filtered.length) {
                    removeItem(filtered[0]);
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

    }
})();
