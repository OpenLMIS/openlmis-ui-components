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
     * @name requisition-approval.controller:RequisitionApprovalListController
     *
     * @description
     * Controller for approval list of requisitions.
     */

	angular
		.module('requisition-approval')
		.controller('RequisitionApprovalListController', controller);

	controller.$inject = ['$controller', '$state', 'items', 'messageService', 'stateParams', 'totalItems'];

	function controller($controller, $state, items, messageService, stateParams, totalItems) {

		var vm = this;

        $controller('BasePaginationController', {
			vm: vm,
            items: items,
            totalItems: totalItems,
			stateParams: stateParams,
			externalPagination: true,
			itemValidator: undefined
		});

		vm.openRnr = openRnr;

        /**
         * @ngdoc property
         * @methodOf requisition-approval.controller:RequisitionApprovalListController
         * @name openRnr
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
