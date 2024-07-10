/*
 * This program is part of the OpenLMIS logistics management information system platform software.
 * Copyright © 2017 VillageReach
 *
 * This program is free software: you can redistribute it and/or modify it under the terms
 * of the GNU Affero General Public License as published by the Free Software Foundation, either
 * version 3 of the License, or (at your option) any later version.
 *  
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY;
 * without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. 
 * See the GNU Affero General Public License for more details. You should have received a copy of
 * the GNU Affero General Public License along with this program. If not, see
 * http://www.gnu.org/licenses.  For additional information contact info@OpenLMIS.org. 
 */

(function() {

    'use strict';

    /**
     * @ngdoc service
     * @name openlmis-local-storage.localStorageFactory
     *
     * @description
     * It stores objects in browser cache to make them accessible offline.
     * Each stored or retrieved object is copied.
     */
    angular
        .module('openlmis-local-storage')
        .factory('localStorageFactory', factory);

    factory.$inject = ['localStorageService', '$filter'];

    function factory(localStorageService, $filter) {
        var resources = {};

        return LocalStorageFactory;

        /**
         * @ngdoc method
         * @methodOf openlmis-local-storage.localStorageFactory
         * @name LocalStorageFactory
         *
         * @description
         * Creates array in local storage that is named with resourceName.
         * It returns object with methods to operate on this resource.
         *
         * @param  {String} resourceName Name of resource to be stored
         * @return {Object}              Object with methods to save/get resource objects
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
                putAll: putAll,
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
             * @ngdoc method
             * @methodOf openlmis-local-storage.localStorageFactory
             * @name put
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
                        items.push(typeof item === 'object' ? JSON.parse(JSON.stringify(item)) : item);
                    });
                }
            }

            /**
             * @ngdoc method
             * @methodOf openlmis-local-storage.localStorageFactory
             * @name putAll
             * 
             * @description
             * Stores all objects in local storage.
             * 
             * @param {Array} collectionToStore Array of objects to store
             */
            function putAll(collectionToStore) {
                if (Array.isArray(collectionToStore) && collectionToStore.length > 0) {
                    executeWithStorageUpdate(function() {
                        items = collectionToStore.map(function(item) {
                            if (item.id) {
                                removeItemBy('id', item.id);
                            }
                            return typeof item === 'object' ? JSON.parse(JSON.stringify(item)) : item;
                        });
                    });
                }
            }

            /**
             * @ngdoc method
             * @methodOf openlmis-local-storage.localStorageFactory
             * @name getBy
             *
             * @description
             * It searches for all objects that given property value is equal
             * and returns first from the list. If there is no results method returns undefined.
             *
             * @param  {String} property Name of object property to be compared
             * @param  {Object} value    Value of property (equals found object property value)
             * @return {Object}          First found object with equal property value
             */
            function getBy(property, value) {
                var filtered = searchItems(toParams(property, value));
                return filtered.length ? JSON.parse(JSON.stringify(filtered[0])) : undefined;
            }

            /**
             * @ngdoc method
             * @methodOf openlmis-local-storage.localStorageFactory
             * @name getAll
             *
             * @description
             * Method returns all resource objects stored in local storage.
             *
             * @return {Array} All objects stored in this resource
             */
            function getAll() {
                return angular.copy(items);
            }

            /**
             * @ngdoc method
             * @methodOf openlmis-local-storage.localStorageFactory
             * @name search
             *
             * @description
             * It takes params and passes it to filter. If filter name is
             * not defined the default filter will be used.
             *
             * @param  {Object} params Criteria passed to filter
             * @param  {String} filter Name of the filter(optional)
             * @return {Array}         Filtered objects
             */
            function search(params, filter) {
                return angular.copy(searchItems(params, filter));
            }

            /**
             * @ngdoc method
             * @methodOf openlmis-local-storage.localStorageFactory
             * @name remove
             *
             * @description
             * Removes a specific object from local storage
             *
             * @param {Object} item Object to remove
             */
            function remove(item) {
                executeWithStorageUpdate(function() {
                    removeItem(item);
                });
            }

            /**
             * @ngdoc method
             * @methodOf openlmis-local-storage.localStorageFactory
             * @name removeBy
             *
             * @description
             * It searches for all objects that given property value is equal
             * and removes first from the list. If there is no results method returns undefined.
             *
             * @param {String} property Name of object property to be compared
             * @param {Object} value    Value of property (equals found object property value)
             */
            function removeBy(property, value) {
                executeWithStorageUpdate(function() {
                    removeItemBy(property, value);
                });
            }

            /**
             * @ngdoc method
             * @methodOf openlmis-local-storage.localStorageFactory
             * @name clearAll
             *
             * @description
             * Removes all items from resource.
             */
            function clearAll() {
                executeWithStorageUpdate(function() {
                    items.splice(0, items.length);
                });
            }

            /**
             * @ngdoc method
             * @methodOf openlmis-local-storage.localStorageFactory
             * @name contains
             *
             * @description
             * Check if exactly same object exist in storage and if so
             * returns true, otherwise false.
             *
             * @param   {Object}  object Object to compare
             * @return {Boolean}        if objects exist a in storage
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
