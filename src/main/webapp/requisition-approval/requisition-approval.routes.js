(function() {

	'use strict';

	angular
		.module('requisition-approval')
		.config(routes);

	routes.$inject = ['$stateProvider', 'RequisitionRights'];

	function routes($stateProvider, RequisitionRights) {

		$stateProvider.state('requisitions.approvalList', {
			showInNavigation: true,
			label: 'link.requisition.approve',
			url: '/approvalList',
			controller: 'RequisitionApprovalListCtrl',
			controllerAs: 'vm',
			templateUrl: 'requisition-approval/requisition-approval-list.html',
			accessRights: [RequisitionRights.REQUISITION_APPROVE],
			resolve: {
		        requisitionList: function (RequisitionService) {
                    return RequisitionService.forApproval();
		        }
		    }
		});

	}

})();
