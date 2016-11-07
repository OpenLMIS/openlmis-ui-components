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

	convertToOrderCtrl.$inject = ['$scope', '$state', '$stateParams', 'requisitions', 'RequisitionService'];

	function convertToOrderCtrl($scope, $state, $stateParams, requisitions, RequisitionService) {

        $scope.searchParams = {
            filterBy: $stateParams.filterBy,
            filterValue: $stateParams.filterValue,
            sortBy: $stateParams.sortBy,
            descending: $stateParams.descending
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

        $scope.requisitions = requisitions;
        $scope.nothingToConvert = !requisitions.length && defaultSearchParams();
        $scope.infoMessage = getInfoMessage();
        $scope.selectAll = false;

        $scope.convertToOrder = convertToOrder;
        $scope.getSelected = getSelected;
        $scope.reload = reload;
        $scope.toggleSelectAll = toggleSelectAll;
        $scope.setSelectAll = setSelectAll;

        function reload() {
            $state.go($state.current.name, $scope.searchParams, {
                reload: true
            });
        }

        function getSelected() {
            var selected = [];
            angular.forEach($scope.requisitions, function(requisition) {
                if (requisition.$selected) {
                    selected.push(requisition);
                }
            });
            return selected;
        }

        function toggleSelectAll(selectAll) {
            angular.forEach($scope.requisitions, function(requisition) {
                requisition.$selected = selectAll;
            });
        }

        function setSelectAll() {
            var value = true;
            angular.forEach($scope.requisitions, function(requisition) {
                value = value && requisition.$selected;
            });
            $scope.selectAll = value;
        }

        function convertToOrder() {
            RequisitionService.convertToOrder(getSelected()).then(reload);
        }

        function getInfoMessage() {
            if ($scope.nothingToConvert) {
                return 'message.no.requisitions.for.conversion';
            } else if (!$scope.requisitions.length) {
                return 'message.no.search.results';
            }
            return undefined;
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


