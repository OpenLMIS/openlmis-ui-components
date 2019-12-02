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
     * @name openlmis-array-decorator.OpenlmisArrayDecorator
     * 
     * @description
     * Decorates an object of the Array class with methods for finding and getting objects by ID. If a given object
     * already has a method with the same name, it won't be overridden.
     */
    angular
        .module('openlmis-array-decorator')
        .factory('OpenlmisArrayDecorator', OpenlmisArrayDecorator);

    OpenlmisArrayDecorator.$inject = ['OpenlmisValidator'];

    function OpenlmisArrayDecorator(OpenlmisValidator) {

        var validator = new OpenlmisValidator();

        return OpenlmisArrayDecorator;

        function OpenlmisArrayDecorator(array) {
            validator.validateExists(array, 'Given array is undefined');
            validator.validateInstanceOf(array, Array, 'Given object is not an instance of Array');

            extendWith(array, 'filterById', filterById);
            extendWith(array, 'getById', getById);
            extendWith(array, 'getAllWithUniqueIds', getAllWithUniqueIds);
            extendWith(array, 'sortBy', sortBy);
            extendWith(array, 'getUnique', getUnique);

            return array;
        }

        /**
         * @ngdoc method
         * @methodOf openlmis-array-decorator.OpenlmisArrayDecorator
         * @name filterById
         * 
         * @description
         * Filters objects in the list by their ids.
         * 
         * @param  {string} id  the ID of the objects
         * @return {Array}      the filtered array
         */
        function filterById(id) {
            validator.validateExists(id, 'Given ID is undefined');

            return this.filter(function(object) {
                return object.id === id;
            });
        }

        /**
         * @ngdoc method
         * @methodOf openlmis-array-decorator.OpenlmisArrayDecorator
         * @name getById
         * 
         * @description
         * Retrieves an object with the given ID. If there are more than one object with the same ID in the list an
         * exception will be thrown.
         * 
         * @param  {string} id  the ID of the objects
         * @return {Array}      the matching object, null if no object matches
         */
        function getById(id) {
            var filtered = this.filterById(id);

            validator.validateLesserThan(filtered.length, 2, 'Array contains multiple objects with the same ID');

            return filtered[0];
        }

        /**
         * @ngdoc method
         * @methodOf openlmis-array-decorator.OpenlmisArrayDecorator
         * @name sortBy
         *
         * @description
         * Sorts the array by the given property in alphabetical order ignoring casing.
         * 
         * @param {String} propertyName  the name of the property to sort by
         */
        function sortBy(propertyName) {
            this.sort(function(a, b) {

                if (undefined !== a[propertyName] && undefined !== b[propertyName]) {
                    var aProperty = a[propertyName].toLowerCase(),
                        bProperty = b[propertyName].toLowerCase();

                    if (aProperty > bProperty) {
                        return 1;
                    }

                    if (aProperty < bProperty) {
                        return -1;
                    }
                }

                return 0;
            });
        }

        /**
         * @ngdoc method
         * @methodOf openlmis-array-decorator.OpenlmisArrayDecorator
         * @name getAllWithUniqueIds
         *
         * @description
         * Return a list of items with unique IDs.
         *
         * @return {Array}  the list of items with unique ids
         */
        function getAllWithUniqueIds() {
            var filtered = [];

            this.forEach(function(item) {
                var existing = filtered.filter(function(filtered) {
                    return filtered.id === item.id;
                });

                if (!existing.length) {
                    filtered.push(item);
                }
            });

            return filtered;
        }

        /**
         * @ngdoc method
         * @methodOf openlmis-array-decorator.OpenlmisArrayDecorator
         * @name getUnique
         *
         * @description
         * Return a list of unique items.
         *
         * @return {Array}  the list of unique items
         */
        function getUnique() {
            var filtered = [];

            this.forEach(function(item) {
                var existing = filtered.filter(function(filtered) {
                    return filtered === item;
                });

                if (!existing.length) {
                    filtered.push(item);
                }
            });

            return filtered;
        }

        function extendWith(array, fnName, fn) {
            if (array[fnName]) {
                console.warn('Given array already has ' + fnName + ' method');
            } else {
                array[fnName] = fn;
            }
        }

    }

})();