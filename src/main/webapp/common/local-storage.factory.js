(function() {

    'use strict';

    /**
     * @ngdoc service
     * @name openlmis.openlmis-core.localStorageFactory
     *
     * @description
     * It stores objects in browser cache to make them accessible offline
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
         * @name  LocalStorageFactory
         * @methodOf openlmis.openlmis-core.localStorageFactory
         * @param {String} resourceName Name of resource to be stored
         * @returns {Object} Object with methods to save/get resource objects
         *
         * @description
         * Creates array in local storage that is named with resourceName.
         * It retruns object with methods to operate on this resource.
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
                removeBy: removeBy,
                clearAll: clearAll,
                contains: contains
            };
            resources[resourceName] = resource;
            return resource;

            /**
             * @ngdoc function
             * @name  put
             * @methodOf openlmis.openlmis-core.localStorageFactory
             * @param {Object} object Object to store
             *
             * @description
             * Stores given object in local storage.
             */
            function put(item) {
                if (item && !contains(item)) {
                    executeWithStorageUpdate(function() {
                        if (item.id) {
                            removeItemBy('id', item.id);
                        }
                        items.push(typeof item === 'object' ? copy(item) : item);
                    });
                }
            }

            /**
             * @ngdoc function
             * @name  getBy
             * @methodOf openlmis.openlmis-core.localStorageFactory
             * @param {String} property Name of object property to be compared
             * @param {Object} value Value of proprty (equals found object property value)
             * @returns {Object} First found object with equal proprty value
             *
             * @description
             * Method takes stored object proprty and desired value. It searches for all objects
             * that given property value is equal and returns first from the list.
             * Returned object is copied, so changes made outside factory will not affect one in
             * local storage. If there is no results method returns undefined.
             */
            function getBy(property, value) {
                var filtered = searchItems(toParams(property, value));
                return filtered.length ? copy(filtered[0]) : undefined;
            }

            /**
             * @ngdoc function
             * @name  getAll
             * @methodOf openlmis.openlmis-core.localStorageFactory
             * @returns {Array} All objects stored in this resource
             *
             * @description
             * Method returns all resource objects stored in local storage.
             * All of retruned objects are copied, so changes made outside factory
             * will not affect any object in local storage.
             */
            function getAll() {
                return copyList(items);
            }

            /**
             * @ngdoc function
             * @name  search
             * @methodOf openlmis.openlmis-core.localStorageFactory
             * @param {Object} params Criteria passed to filter
             * @param {String} filter Name of the filter(optional)
             * @returns {Array} Filtered objects
             *
             * @description
             * It takes params and passes it to filter. If filter name is
             * not defined the default filter will be used. All found objects
             * are copied, so changes made outside factory will not affect any object in local storage.
             */
            function search(params, filter) {
                return copyList(searchItems(params, filter));
            }

            /**
             * @ngdoc function
             * @name  getBy
             * @methodOf openlmis.openlmis-core.localStorageFactory
             * @param {String} property Name of object property to be compared
             * @param {Object} value Value of proprty (equals found object property value)
             *
             * @description
             * Method takes stored object proprty and desired value. It searches for all objects
             * that given property value is equal and removes first from the list.
             * If there is no results no object will be removed.
             */
            function removeBy(property, value) {
                executeWithStorageUpdate(function() {
                    removeItemBy(property, value);
                });
            }

            /**
             * @ngdoc function
             * @name  clearAll
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
             * @name  contains
             * @methodOf openlmis.openlmis-core.localStorageFactory
             * @param {Object} object Object to compare
             * @returns {Boolean} if objects exista in storage
             *
             * @description
             * Check if exactly same object exist in storage and if so
             * returns true, otherwise false.
             */
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
