/*
 * This program is part of the OpenLMIS logistics management information system platform software.
 * Copyright © 2013 VillageReach
 *
 * This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 *  
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public License for more details.
 * You should have received a copy of the GNU Affero General Public License along with this program.  If not, see http://www.gnu.org/licenses.  For additional information contact info@OpenLMIS.org. 
 */

(function() {

	'use strict';

	angular
		.module('openlmis.requisitions')
		.controller('ConvertToOrderCtrl', convertToOrderCtrl);

	convertToOrderCtrl.$inject = ['$scope', 'RequisitionService', 'messageService', 'uiGridConstants', '$ngBootbox', 'NotificationModal'];

	function convertToOrderCtrl($scope, RequisitionService, messageService, uiGridConstants, $ngBootbox, NotificationModal) {

        $scope.reloadGrid = reloadGrid;
        $scope.translate = translate;
        $scope.convertToOrder = convertToOrder;
        $scope.getInfoMessage = getInfoMessage;

        $scope.searchParams = {
            filterBy: 'all',
            filterValue: ''
        };

		$scope.filters = [
			{
                value: 'all',
                name: 'option.value.all'
            }, {
                value: 'programName',
                name: 'option.value.program'
            }, {
                value: 'facilityCode',
                name: 'option.value.facility.code'
            }, {
                value: 'facilityName',
                name: 'option.value.facility.name'
            }/*, {
                value: 'supplyingDepot',
                name: 'label.supplying.depot'
            }*/
		];

		$scope.gridOptions = {
            data: 'filteredRequisitions',
            enableRowSelection: true,
            enableSelectAll: true,
			sortInfo: $scope.sortOptions,
            enableColumnMenus: false,
			useExternalSorting: true,
			columnDefs: [
                {
                    field: 'requisition.program.name',
                    displayName: messageService.get("program.header"),
                    sortName: 'programName',
                    enableColumnMenus: false
                }, {
                    field: 'requisition.facility.code',
                    displayName: messageService.get("option.value.facility.code"),
                    sortName: 'facilityCode',
                    enableColumnMenus: false
                }, {
                    field: 'requisition.facility.name',
                    displayName: messageService.get("option.value.facility.name"),
                    sortName: 'facilityName',
                    enableColumnMenus: false
                }, {
                    field: 'requisition.facility.geographicZone.parent.name',
                    displayName: messageService.get("option.value.facility.district"),
                    enableSorting: false
                }, {
                    field: 'requisition.processingPeriod.startDate',
                    displayName: messageService.get("label.period.start.date"),
                    enableSorting: false,
                    cellFilter: 'dateFilter'
                }, {
                    field: 'requisition.processingPeriod.endDate',
                    displayName: messageService.get("label.period.end.date"),
                    enableSorting: false,
                    cellFilter: 'dateFilter'
                }, /*{
                    field: 'stringSubmittedDate',
                    displayName: messageService.get("label.date.submitted"),,
                    enableSorting: false
                    cellFilter: 'dateFilter'
                },*/ {
                    field: 'requisition.processingPeriod.processingSchedule.modifiedDate',
                    displayName: messageService.get("label.date.modified"),
                    enableSorting: false,
                    cellFilter: 'dateFilter'
                }, {
                    name: 'supplyingDepotName',
					displayName: messageService.get("label.supplying.depot"),
                    enableSorting: false,
					cellTemplate: 'requisitions/convert-to-order/supplying-depot-cell.html',
                    width: 220
                }, {
                    name: 'emergency',
                    displayName: messageService.get("requisition.type.emergency"),
                    enableSorting: false,
					cellTemplate: 'requisitions/convert-to-order/emergency-cell.html',
					width: 110 
                }
            ],
            onRegisterApi: onRegisterApi
		};

        reloadGrid();

        function reloadGrid() {
            RequisitionService.forConvert($scope.searchParams).then(
                function(requisitions) {
                    $scope.filteredRequisitions = requisitions;
                    $scope.nothingToConvert = !$scope.filteredRequisitions.length && defaultSearchParams();
                }
            );
        }

        function translate(message) {
            return messageService.get(message);
        }

        function convertToOrder() {
            RequisitionService.convertToOrder($scope.gridApi.selection.getSelectedRows()).then(reloadGrid);
        }

        function getInfoMessage() {
            if ($scope.nothingToConvert) {
                return 'message.no.requisitions.for.conversion';
            } else if ($scope.filteredRequisitions && !$scope.filteredRequisitions.length) {
                return 'message.no.search.results';
            }
            return undefined;
        }

        function onRegisterApi(gridApi) {
            $scope.gridApi = gridApi;
            $scope.gridApi.core.on.sortChanged($scope, sortChanged);
        }

        function sortChanged(grid, sortColumns) {
            if (sortColumns.length) {
                $scope.searchParams.sortBy = sortColumns[0].colDef.sortName;
                $scope.searchParams.descending = sortColumns[0].direction === uiGridConstants.DESC;
            } else {
                $scope.searchParams.sortBy = '';
                $scope.searchParams.descending = true;
            }
            reloadGrid();
        }

        function defaultSearchParams() {
            return $scope.searchParams.filterBy === 'all'
                && isEmpty($scope.searchParams.filterValue)
                && isUndefined($scope.searchParams.sortBy)
                && isUndefined($scope.searchParams.descending)
                && isUndefined($scope.searchParams.pageNumber)
                && isUndefined($scope.searchParams.pageSize);
        }

        function isEmpty(value) {
            return value === '';
        }

        function isUndefined(value) {
            return value === undefined;
        }
	}

})();


