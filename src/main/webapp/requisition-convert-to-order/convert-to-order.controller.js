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

    /**
     * @ngdoc controller
     * @name openlmis.requisitions.ConvertToOrderCtrl
     *
     * @description
     * Controller for converting requisitions to orders.
     */

	angular
		.module('requisition-convert-to-order')
		.controller('ConvertToOrderCtrl', convertToOrderCtrl);

	convertToOrderCtrl.$inject = ['$state', '$stateParams', 'requisitions', 'RequisitionService', 'Notification'];

	function convertToOrderCtrl($state, $stateParams, requisitions, RequisitionService, Notification) {

	    var vm = this;

        /**
         * @ngdoc property
         * @name searchParams
         * @propertyOf openlmis.requisitions.ConvertToOrderCtrl
         * @type {Object}
         *
         * @description
         * Holds parameters for searching requisitions.
         */
        vm.searchParams = {
            filterBy: $stateParams.filterBy,
            filterValue: $stateParams.filterValue,
            sortBy: $stateParams.sortBy,
            descending: $stateParams.descending
        };

        /**
         * @ngdoc property
         * @name filters
         * @propertyOf openlmis.requisitions.ConvertToOrderCtrl
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
                name: 'label.supplying.depot'
            }*/
        ];

        /**
         * @ngdoc property
         * @name requisitions
         * @propertyOf openlmis.requisitions.ConvertToOrderCtrl
         * @type {Array}
         *
         * @description
         * Holds requisitions that can be converted to orders.
         */
        vm.requisitions = requisitions;

        /**
         * @ngdoc property
         * @name nothingToConvert
         * @type {boolean}
         *
         * @description
         * Indicates if there is any requisition available to convert to order or not.
         */
        vm.nothingToConvert = !requisitions.length && defaultSearchParams();

        /**
         * @ngdoc property
         * @name infoMessage
         * @propertyOf openlmis.requisitions.ConvertToOrderCtrl
         * @type {Object}
         *
         * @description
         * Holds message that should be displayed to user.
         */
        vm.infoMessage = getInfoMessage();

        /**
         * @ngdoc property
         * @name selectAll
         * @propertyOf openlmis.requisitions.ConvertToOrderCtrl
         * @type {boolean}
         *
         * @description
         * Indicates if all requisitions from list all selected or not.
         */
        vm.selectAll = false;

        //Functions

        vm.convertToOrder = convertToOrder;
        vm.getSelected = getSelected;
        vm.reload = reload;
        vm.toggleSelectAll = toggleSelectAll;
        vm.setSelectAll = setSelectAll;

        /**
         * @ngdoc function
         * @name reload
         * @methodOf openlmis.requisitions.ConvertToOrderCtrl
         *
         * @description
         * Responsible for reloading current state with chosen search parameters.
         */
        function reload() {
            $state.go($state.current.name, vm.searchParams, {
                reload: true
            });
        }

        /**
         * @ngdoc function
         * @name getSelected
         * @methodOf openlmis.requisitions.ConvertToOrderCtrl
         *
         * @description
         * Returns list of selected by user requisitions, that are supposed to be converted to orders.
         *
         * @return {Array} list of selected requisitions
         */
        function getSelected() {
            var selected = [];
            angular.forEach(vm.requisitions, function(requisition) {
                if (requisition.$selected) {
                    selected.push(requisition);
                }
            });
            return selected;
        }

        /**
         * @ngdoc function
         * @name toggleSelectAll
         * @methodOf openlmis.requisitions.ConvertToOrderCtrl
         *
         * @description
         * Responsible for marking/unmarking all requisitions as selected.
         *
         * @param {Boolean} selectAll Determines if all requisitions should be selected or not
         */
        function toggleSelectAll(selectAll) {
            angular.forEach(vm.requisitions, function(requisition) {
                requisition.$selected = selectAll;
            });
        }

        /**
         * @ngdoc function
         * @name setSelectAll
         * @methodOf openlmis.requisitions.ConvertToOrderCtrl
         *
         * @description
         * Responsible for making the checkbox "select all" checked when all requisitions are selected by user.
         */
        function setSelectAll() {
            var value = true;
            angular.forEach(vm.requisitions, function(requisition) {
                value = value && requisition.$selected;
            });
            vm.selectAll = value;
        }

        /**
         * @ngdoc function
         * @name convertToOrder
         * @methodOf openlmis.requisitions.ConvertToOrderCtrl
         *
         * @description
         * Responsible for converting seleted requisitions to orders.
         */
        function convertToOrder() {
            var requisitions = getSelected();
            if (requisitions.length > 0) {
                RequisitionService.convertToOrder(requisitions).then(reload);
            } else {
                Notification.error('msg.select.at.least.one.rnr');
            }
        }

        /**
         * @ngdoc function
         * @name getInfoMessage
         * @methodOf openlmis.requisitions.ConvertToOrderCtrl
         *
         * @description
         * Responsible for setting proper info message to display to user.
         *
         * @return {Object} message that should be displayed to user
         */
        function getInfoMessage() {
            if (vm.nothingToConvert) {
                return 'message.no.requisitions.for.conversion';
            } else if (!vm.requisitions.length) {
                return 'message.no.search.results';
            }
            return undefined;
        }

        /**
         * @ngdoc function
         * @name defaultSearchParams
         * @methodOf openlmis.requisitions.ConvertToOrderCtrl
         *
         * @description
         * Determines whether default search parameters are set or not.
         *
         * @return {Boolean} are default parameters set
         */
        function defaultSearchParams() {
            return vm.searchParams.filterBy === 'all'
                && isEmpty(vm.searchParams.filterValue)
                && isUndefined(vm.searchParams.sortBy)
                && isUndefined(vm.searchParams.descending)
                && isUndefined(vm.searchParams.pageNumber)
                && isUndefined(vm.searchParams.pageSize);
        }

        /**
         * @ngdoc function
         * @name isEmpty
         * @methodOf openlmis.requisitions.ConvertToOrderCtrl
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
         * @methodOf openlmis.requisitions.ConvertToOrderCtrl
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
