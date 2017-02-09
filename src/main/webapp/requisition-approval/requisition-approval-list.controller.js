(function() {

	'use strict';

    /**
     * @ngdoc controller
     * @name requisition-approval.RequisitionApprovalListController
     *
     * @description
     * Controller for approval list of requisitions.
     */

	angular
		.module('requisition-approval')
		.controller('RequisitionApprovalListController', controller);

	controller.$inject = ['$state', 'requisitionList', 'messageService'];

	function controller($state, requisitionList, messageService) {

		var vm = this;

		vm.openRnr = openRnr;
		vm.changeSortOrder = changeSortOrder;

        /**
         * @ngdoc property
         * @name requisitions
         * @propertyOf requisition-approval.RequisitionApprovalListController
         * @type {Array}
         *
         * @description
         * Holds requisitions.
         */
		vm.requisitions = requisitionList;

		/**
         * @ngdoc property
         * @name columns
         * @propertyOf requisition-approval.RequisitionApprovalListController
         * @type {Array}
         *
         * @description
         * Holds available columns for sorting.
         */
		vm.columns = [
			{
				name: 'program.name',
				label: messageService.get('label.program')
			},
			{
				name: 'facility.code',
				label: messageService.get('label.facilityCode')
			},
			{
				name: 'facility.name',
				label: messageService.get('label.facilityName')
			},
			{
				name: 'facility.type.name',
				label: messageService.get('label.facilityType')
			}
		];

		/**
		 * @ngdoc property
		 * @name selectedColumn
		 * @propertyOf requisition-approval.RequisitionApprovalListController
		 * @type {Array}
		 *
		 * @description
		 * Holds current column that items are sorted by.
		 */
		vm.selectedColumn = vm.columns[0].name;

		/**
		 * @ngdoc property
		 * @name reverse
		 * @propertyOf requisition-approval.RequisitionApprovalListController
		 * @type {Array}
		 *
		 * @description
		 * True if items are sorted descending.
		 */
		vm.reverse = true;

		/**
         * @ngdoc method
         * @name changeSortOrder
         * @propertyOf requisition-approval.RequisitionApprovalListController
         *
         * @description
         * Changes sort order (ascending/descending).
         */
		function changeSortOrder() {
			vm.reverse = !vm.reverse;
		}

        /**
         * @ngdoc property
         * @name openRnr
         * @propertyOf requisition-approval.RequisitionApprovalListController
         *
         * @description
         * Holds handler which redirects to requisition page after clicking on grid row.
         */
		function openRnr(requisitionId) {
			$state.go('requisitions.requisition.fullSupply', {
				rnr: requisitionId
			});
		}
	}

})();
