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
     * @name openlmis-table:openlmisTableSortingService
     *
     * @description
     * Responsible for every operation regarding sorting the table
     */
    angular
        .module('openlmis-table')
        .service('openlmisTableSortingService', openlmisTableSortingService);

    openlmisTableSortingService.$inject = ['SORTING_SERVICE_CONSTANTS', '$state', '$stateParams'];

    function openlmisTableSortingService(SORTING_SERVICE_CONSTANTS, $state, $stateParams) {
        var EMPTY_SORTING_PROPERTIES = {
            isSortedBy: undefined,
            sortingOrder: '',
            headerClass: ''
        };

        var sortingProperties = angular.copy(EMPTY_SORTING_PROPERTIES);

        return {
            sortTable: sortTable,
            setHeadersClasses: setHeadersClasses,
            isColumnSortable: isColumnSortable
        };

        /**
         * @ngdoc method
         * @methodOf openlmis-table:openlmisTableSortingService
         * @name sortTable
         *
         * @description Orders a table by given column. By sending request with updated
         *  sort state param
         *
         * @param {Object} selectedColumn
         */
        function sortTable(selectedColumn) {
            var propertyToOrder = selectedColumn.propertyPath;
            var stateParams = angular.copy($stateParams);
            setSortingProperties(propertyToOrder);
            stateParams.sort = getSortingParamValue(propertyToOrder);
            $state.go($state.current.name, stateParams);
        }

        function getSortingParamValue(propertyToOrder) {
            if (sortingProperties.isSortedBy === undefined) {
                return undefined;
            }
            return propertyToOrder + ',' + sortingProperties.sortingOrder;
        }

        function setSortingProperties(propertyToOrder) {
            if (sortingProperties.isSortedBy === undefined ||
                sortingProperties.isSortedBy !== propertyToOrder
            ) {
                setSortingPropertiesValue({
                    isSortedBy: propertyToOrder,
                    sortingOrder: SORTING_SERVICE_CONSTANTS.ASC,
                    headerClass: SORTING_SERVICE_CONSTANTS.SORT_ASC_CLASS
                });
            } else if (sortingProperties.sortingOrder === SORTING_SERVICE_CONSTANTS.ASC) {
                setSortingPropertiesValue({
                    isSortedBy: propertyToOrder,
                    sortingOrder: SORTING_SERVICE_CONSTANTS.DESC,
                    headerClass: SORTING_SERVICE_CONSTANTS.SORT_DESC_CLASS
                });
            } else {
                setSortingPropertiesValue(angular.copy(EMPTY_SORTING_PROPERTIES));
            }
        }

        function setSortingPropertiesValue(sortingPropertiesValue) {
            sortingProperties = angular.copy(sortingPropertiesValue);
        }

        /**
         * @ngdoc method
         * @methodOf openlmis-table:openlmisTableSortingService
         * @name setHeadersClasses
         *
         * @description
         *  Sets the classes of table headers. If table is ordered by some header
         *   it will assign a special class
         * @param  {Array<Object>} columns
         */
        function setHeadersClasses(columns) {
            setInitialSortingProperties();

            columns.forEach(function(column) {
                column.class = getColumnClass(column);
            });
        }

        function setInitialSortingProperties() {
            var sortParam = Array.isArray($stateParams.sort) ?
                $stateParams.sort[0] :
                $stateParams.sort;

            if (sortParam) {
                sortingProperties = getSortingPropertiesFromParam(sortParam);
            } else {
                setSortingPropertiesValue(EMPTY_SORTING_PROPERTIES);
            }
        }

        function getSortingPropertiesFromParam(sortParam) {
            if (sortParam === undefined) {
                setSortingPropertiesValue(EMPTY_SORTING_PROPERTIES);
            }

            var sortParamParts = sortParam.split(',');
            var isSortedBy = sortParamParts[0];
            // Removing whitespaces from sorting param
            var sortingOrder = sortParamParts[1].split(' ').join('');
            var headerClass = sortingOrder === SORTING_SERVICE_CONSTANTS.ASC ?
                SORTING_SERVICE_CONSTANTS.SORT_ASC_CLASS : SORTING_SERVICE_CONSTANTS.SORT_DESC_CLASS;

            return {
                isSortedBy: isSortedBy,
                sortingOrder: sortingOrder,
                headerClass: headerClass
            };
        }

        function getColumnClass(column) {
            var baseClass = column.headerClasses ? column.headerClasses : '';

            return isSortedByColumn(column.propertyPath) ?
                baseClass + ' ' + sortingProperties.headerClass : baseClass;
        }

        function isSortedByColumn(propertyPath) {
            return propertyPath === sortingProperties.isSortedBy;
        }

        function hasNestedProperties(column) {
            var propertyPathParts = column.propertyPath.split('.');
            return propertyPathParts.length > 1;
        }

        /**
         * @ngdoc method
         * @methodOf openlmis-table:openlmisTableSortingService
         * @name isColumnSortable
         *
         * @description Checks if column is sortable
         *
         * @param  {Object} column
         */
        function isColumnSortable(column) {
            return (column.sortable === undefined || column.sortable) &&
                column.propertyPath !== undefined &&
                !hasNestedProperties(column);
        }
    }
})();
