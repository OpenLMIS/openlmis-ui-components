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

    controller.$inject = ['$state', '$stateParams', '$scope', '$filter'];

    function controller($state, $stateParams, $scope, $filter) {

        var sort = this;

        sort.$onInit = onInit;
        sort.changeSort = changeSort;

        /**
         * @ngdoc property
         * @propertyOf openlmis-sort.controller:SortController
         * @name externalSort
         * @type {Boolean}
         *
         * @description
         * Indicates if sort logic is external.
         */
        sort.externalSort = undefined;

        /**
         * @ngdoc property
         * @propertyOf openlmis-sort.controller:SortController
         * @name sort
         * @type {String}
         *
         * @description
         * Holds sort value.
         */
        sort.sort = undefined;

        $scope.$watchCollection(function() {
            return sort.list;
        }, function() {
            onInit();
        });

        function onInit() {
            sort.externalSort = sort.list ? false : true;
            sort.sort = $stateParams.sort;
            if (!sort.externalSort) {
                sort.list = $filter('orderBy')(sort.list, [sort.sort]);
            }
        }

        /**
         * @ngdoc method
         * @methodOf openlmis-sort.controller:SortController
         * @name changeSort
         *
         * @description
         * Changes the current sort to a new one.
         */
        function changeSort(newPage) {
            if (!sort.externalSort) {
                sort.list = $filter('orderBy')(sort.list, [sort.sort]);
            }

            var stateParams = angular.copy($stateParams);
            stateParams.sort = sort.sort;

            $state.go($state.current.name, stateParams, {
                reload: sort.externalSort,
                notify: sort.externalSort
            });
        }
    }
})();
