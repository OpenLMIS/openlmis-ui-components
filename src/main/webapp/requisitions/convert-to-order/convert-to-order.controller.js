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

	convertToOrderCtrl.$inject = ['$state', '$stateParams', 'requisitions', 'RequisitionService', 'Notification'];

	function convertToOrderCtrl($state, $stateParams, requisitions, RequisitionService, Notification) {

	    var vm = this;

        vm.searchParams = {
            filterBy: $stateParams.filterBy,
            filterValue: $stateParams.filterValue,
            sortBy: $stateParams.sortBy,
            descending: $stateParams.descending
        };

        vm.filters = [
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

        vm.requisitions = requisitions;
        vm.nothingToConvert = !requisitions.length && defaultSearchParams();
        vm.infoMessage = getInfoMessage();
        vm.selectAll = false;

        vm.convertToOrder = convertToOrder;
        vm.getSelected = getSelected;
        vm.reload = reload;
        vm.toggleSelectAll = toggleSelectAll;
        vm.setSelectAll = setSelectAll;

        function reload() {
            $state.go($state.current.name, vm.searchParams, {
                reload: true
            });
        }

        function getSelected() {
            var selected = [];
            angular.forEach(vm.requisitions, function(requisition) {
                if (requisition.$selected) {
                    selected.push(requisition);
                }
            });
            return selected;
        }

        function toggleSelectAll(selectAll) {
            angular.forEach(vm.requisitions, function(requisition) {
                requisition.$selected = selectAll;
            });
        }

        function setSelectAll() {
            var value = true;
            angular.forEach(vm.requisitions, function(requisition) {
                value = value && requisition.$selected;
            });
            vm.selectAll = value;
        }

        function convertToOrder() {
            var requisitions = getSelected();
            if (requisitions.length > 0) {
                RequisitionService.convertToOrder(requisitions).then(reload);
            } else {
                Notification.error('msg.select.at.least.one.rnr');
            }
        }

        function getInfoMessage() {
            if (vm.nothingToConvert) {
                return 'message.no.requisitions.for.conversion';
            } else if (!vm.requisitions.length) {
                return 'message.no.search.results';
            }
            return undefined;
        }

        function defaultSearchParams() {
            return vm.searchParams.filterBy === 'all'
                && isEmpty(vm.searchParams.filterValue)
                && isUndefined(vm.searchParams.sortBy)
                && isUndefined(vm.searchParams.descending)
                && isUndefined(vm.searchParams.pageNumber)
                && isUndefined(vm.searchParams.pageSize);
        }

        function isEmpty(value) {
            return value === '';
        }

        function isUndefined(value) {
            return value === undefined;
        }
	}

})();


