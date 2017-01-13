(function() {

	'use strict';

	angular.module('requisition-search').config(routes);

	routes.$inject = ['$stateProvider', 'REQUISITION_RIGHTS'];

	function routes($stateProvider, REQUISITION_RIGHTS) {

		$stateProvider.state('requisitions.search', {
			showInNavigation: true,
			label: 'link.requisition.view',
			url: '/view',
			controller: 'RequisitionSearchController',
			templateUrl: 'requisition-search/requisition-search.html',
			accessRights: [
				REQUISITION_RIGHTS.REQUISITION_VIEW
			],
			controllerAs: 'vm',
			resolve: {
				user: function(authorizationService) {
                    return authorizationService.getUser();
                },
		        facilityList: function (facilityFactory, user, REQUISITION_RIGHTS) {
		        	return facilityFactory.getUserFacilities(user.user_id, REQUISITION_RIGHTS.REQUISITION_VIEW);
		        }
		    }
		});

	}

})();
