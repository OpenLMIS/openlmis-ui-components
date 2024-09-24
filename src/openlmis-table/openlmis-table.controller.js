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
     * @name openlmis-table.controller:OpenlmisTableController      *
     * @description
     * Manages the openlmis-table component
     */
    angular
        .module('openlmis-table')
        .controller('OpenlmisTableController', OpenlmisTableController);

    OpenlmisTableController.$inject = ['openlmisTableService', 'openlmisTableSortingService', '$scope'];

    function OpenlmisTableController(openlmisTableService, openlmisTableSortingService, $scope) {
        var $ctrl = this;
        $ctrl.sortTable = sortTable;
        $ctrl.$onInit = onInit;
        $ctrl.isColumnSortable = isColumnSortable;
        $ctrl.getItem = getItem;
        $ctrl.selectAll = undefined;

        function onInit() {
            $ctrl.selectAll = $ctrl.tableConfig.initialSelectAll === undefined ?
                false : $ctrl.tableConfig.initialSelectAll;
            openlmisTableService.setColumnsDefaults($ctrl.tableConfig.columns);
            openlmisTableSortingService.setHeadersClasses($ctrl.tableConfig.columns);
            $ctrl.elementsConfiguration = openlmisTableService.getElementsConfiguration($ctrl.tableConfig);
            $ctrl.headersConfiguration = openlmisTableService.getHeadersConfiguration($ctrl.tableConfig.columns);

            $scope.$watch('$ctrl.tableConfig', function(newVal, oldVal) {
                if (newVal.data !== oldVal.data) {
                    $ctrl.elementsConfiguration = undefined;
                    $scope.$applyAsync(function() {
                        $ctrl.elementsConfiguration = openlmisTableService.getElementsConfiguration(newVal);
                    });
                }
            }, true);
        }

        function sortTable(chosenColumn) {
            if (isColumnSortable(chosenColumn)) {
                openlmisTableSortingService.sortTable(chosenColumn);
            }
        }

        function isColumnSortable(selectedColumn) {
            return openlmisTableSortingService.isColumnSortable(selectedColumn);
        }

        function getItem(parentIndex, childIndex) {
            return $ctrl.elementsConfiguration[parentIndex][childIndex].item;
        }
    }
})();
