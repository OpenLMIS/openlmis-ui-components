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
			controller: 'RequisitionApprovalListController',
			controllerAs: 'vm',
			templateUrl: 'requisition-approval/requisition-approval-list.html',
			accessRights: [RequisitionRights.REQUISITION_APPROVE],
			resolve: {
		        requisitionList: function (requisitionService) {
                    return requisitionService.forApproval();
		        }
		    }
		});

	}

})();
