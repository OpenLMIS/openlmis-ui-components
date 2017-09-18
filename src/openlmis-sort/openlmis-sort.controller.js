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
     * @ngdoc controller
     * @name openlmis-sort.controller:SortController
     *
     * @description
     * Responsible for managing sort element.
     */
    angular
        .module('openlmis-sort')
        .controller('SortController', controller);

    controller.$inject = ['$state', '$stateParams'];

    function controller($state, $stateParams) {

        var sort = this;

        sort.$onInit = onInit;
        sort.changeSort = changeSort;
        sort.getCurrentSortDisplay = getCurrentSortDisplay;

        /**
         * @ngdoc property
         * @propertyOf openlmis-sort.controller:SortController
         * @name sort
         * @type {String}
         *
         * @description
         * Holds sort value.
         */

         /**
         * @ngdoc property
         * @propertyOf openlmis-sort.controller:SortController
         * @name onChange
         * @type {Function}
         *
         * @description
         * Method that will be executed on sort change with sort value as parameter.
         * Also indicates if screen is using external sorting or values are sorted in browser.
         */

        /**
         * @ngdoc property
         * @propertyOf openlmis-sort.controller:SortController
         * @name options
         * @type {Array}
         *
         * @description
         * List of sort options.
         */

        /**
         * @ngdoc property
         * @propertyOf openlmis-sort.controller:SortController
         * @name options
         * @type {Boolean}
         *
         * @description
         * Indicates if component should reload state after sort changes.
         */
        sort.externalSort = undefined;

        /**
         * @ngdoc method
         * @methodOf openlmis-sort.controller:SortController
         * @name onInit
         *
         * @description
         * Initiate method for SortController.
         */
        function onInit() {
            if (sort.onChange && !angular.isFunction(sort.onChange)) {
                throw 'Parameter onChange is not a function!';
            }

            sort.sort = $stateParams.sort;

            if (sort.externalSort === undefined || sort.externalSort === null) {
                sort.externalSort = true;
            }
        }

        /**
         * @ngdoc method
         * @methodOf openlmis-sort.controller:SortController
         * @name onInit
         *
         * @description
         * Sets new sort value and reloads .
         *
         * @param {Object} newSort newly selected sort value
         */
        function changeSort(newSort) {
            sort.sort = newSort.value;
            if (sort.onChange) {
                sort.onChange(newSort.value);
            }

            var stateParams = angular.copy($stateParams);
            stateParams.sort = sort.sort;

            $state.go($state.current.name, stateParams, {
                reload: sort.externalSort,
                notify: sort.externalSort
            });
        }

        /**
         * @ngdoc method
         * @methodOf openlmis-sort.controller:SortController
         * @name getCurrentSortDisplay
         *
         * @description
         * Return display value for current sort if corresponding value exists in options list.
         *
         * @return {String} display value for current sort
         */
        function getCurrentSortDisplay() {
            var result;
            angular.forEach(sort.options, function(option) {
                if (option.value === sort.sort) {
                    result = option.display;
                }
            });
            return result;
        }
    }
})();
