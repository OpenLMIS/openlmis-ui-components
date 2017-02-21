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
     * @name requisition-convert-to-order.ConvertToOrderController
     *
     * @description
     * Controller for converting requisitions to orders.
     */

	angular
		.module('requisition-convert-to-order')
		.controller('ConvertToOrderController', convertToOrderCtrl);

	convertToOrderCtrl.$inject = [
        '$controller', '$stateParams', 'requisitionService', 'notificationService', 'items', 'page',
        'pageSize', 'totalItems'
    ];

	function convertToOrderCtrl($controller, $stateParams, requisitionService, notificationService,
                                items, page, pageSize, totalItems) {

	    var vm = this;

        $controller('BasePaginationController', {
			vm: vm,
            items: items,
			page: page,
			pageSize: pageSize,
            totalItems: totalItems,
			externalPagination: true,
			itemValidator: undefined
		});

        vm.stateParams.filterBy = $stateParams.filterBy;
        vm.stateParams.filterValue = $stateParams.filterValue;
		vm.stateParams.sortBy = $stateParams.sortBy;
		vm.stateParams.descending = $stateParams.descending;

        vm.convertToOrder = convertToOrder;
        vm.getSelected = getSelected;
        vm.toggleSelectAll = toggleSelectAll;
        vm.setSelectAll = setSelectAll;

        /**
         * @ngdoc property
         * @name filters
         * @propertyOf requisition-convert-to-order.ConvertToOrderController
         * @type {Array}
         *
         * @description
         * Holds filters that can be chosen to search for requisitions.
         */
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
                name: 'label.supplyingDepot'
            }*/
        ];

        /**
         * @ngdoc property
         * @name nothingToConvert
         * @type {boolean}
         *
         * @description
         * Indicates if there is any requisition available to convert to order or not.
         */
        vm.nothingToConvert = !items.length && defaultSearchParams();

        /**
         * @ngdoc property
         * @name infoMessage
         * @propertyOf requisition-convert-to-order.ConvertToOrderController
         * @type {Object}
         *
         * @description
         * Holds message that should be displayed to user.
         */
        vm.infoMessage = getInfoMessage();

        /**
         * @ngdoc property
         * @name selectAll
         * @propertyOf requisition-convert-to-order.ConvertToOrderController
         * @type {boolean}
         *
         * @description
         * Indicates if all requisitions from list all selected or not.
         */
        vm.selectAll = false;

        /**
         * @ngdoc function
         * @name getSelected
         * @methodOf requisition-convert-to-order.ConvertToOrderController
         *
         * @description
         * Returns a list of requisitions selected by user, that are supposed to be converted to orders.
         *
         * @return {Array} list of selected requisitions
         */
        function getSelected() {
            var selected = [];
            angular.forEach(vm.pageItems, function(requisition) {
                if (requisition.$selected) {
                    selected.push(requisition);
                }
            });
            return selected;
        }

        /**
         * @ngdoc function
         * @name toggleSelectAll
         * @methodOf requisition-convert-to-order.ConvertToOrderController
         *
         * @description
         * Responsible for marking/unmarking all requisitions as selected.
         *
         * @param {Boolean} selectAll Determines if all requisitions should be selected or not
         */
        function toggleSelectAll(selectAll) {
            angular.forEach(vm.pageItems, function(requisition) {
                requisition.$selected = selectAll;
            });
        }

        /**
         * @ngdoc function
         * @name setSelectAll
         * @methodOf requisition-convert-to-order.ConvertToOrderController
         *
         * @description
         * Responsible for making the checkbox "select all" checked when all requisitions are selected by user.
         */
        function setSelectAll() {
            var value = true;
            angular.forEach(vm.pageItems, function(requisition) {
                value = value && requisition.$selected;
            });
            vm.selectAll = value;
        }

        /**
         * @ngdoc function
         * @name convertToOrder
         * @methodOf requisition-convert-to-order.ConvertToOrderController
         *
         * @description
         * Responsible for converting seleted requisitions to orders.
         */
        function convertToOrder() {
            var requisitions = getSelected();
            var missedDepots = false;
            if (requisitions.length > 0) {
                angular.forEach(requisitions, function(item) {
                    if (!item.requisition.supplyingFacility) {
                        missedDepots = true;
                        notificationService.error('msg.noSupplyingDepotSelected');
                    }
                });
                if (!missedDepots) {
                    requisitionService.convertToOrder(requisitions).then(vm.changePage);
                }
            } else {
                notificationService.error('msg.select.at.least.one.rnr');
            }
        }

        /**
         * @ngdoc function
         * @name getInfoMessage
         * @methodOf requisition-convert-to-order.ConvertToOrderController
         *
         * @description
         * Responsible for setting proper info message to display to user.
         *
         * @return {Object} message that should be displayed to user
         */
        function getInfoMessage() {
            if (vm.nothingToConvert) {
                return 'message.no.requisitions.for.conversion';
            } else if (!vm.pageItems.length) {
                return 'message.no.search.results';
            }
            return undefined;
        }

        /**
         * @ngdoc function
         * @name defaultSearchParams
         * @methodOf requisition-convert-to-order.ConvertToOrderController
         *
         * @description
         * Determines whether default search parameters are set or not.
         *
         * @return {Boolean} are default parameters set
         */
        function defaultSearchParams() {
            return vm.stateParams.filterBy === 'all' &&
                isEmpty(vm.stateParams.filterValue) &&
                isUndefined(vm.stateParams.sortBy) &&
                isUndefined(vm.stateParams.descending) &&
                !vm.stateParams.page;
        }

        /**
         * @ngdoc function
         * @name isEmpty
         * @methodOf requisition-convert-to-order.ConvertToOrderController
         *
         * @description
         * Determines if the given parameter is an empty string.
         *
         * @param {String} value value to be checked
         * @return {Boolean} is given parameter empty
         */
        function isEmpty(value) {
            return value === '';
        }

        /**
         * @ngdoc function
         * @name isUndefined
         * @methodOf requisition-convert-to-order.ConvertToOrderController
         *
         * @description
         * Determines if the given value is undefined.
         *
         * @param {Object} value value to be checked
         * @return {Boolean} is given value undefined
         */
        function isUndefined(value) {
            return value === undefined;
        }
	}

})();
