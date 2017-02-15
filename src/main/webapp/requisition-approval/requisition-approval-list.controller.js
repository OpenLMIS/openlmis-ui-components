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
