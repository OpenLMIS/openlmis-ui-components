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
				supervisedPrograms: function (userProgramsFactory, user) {
                    return userProgramsFactory.get(user.user_id, false);
                },
		        facilityList: function (supervisedPrograms, facilityService, user) {
		        	return facilityService.getsupervisedFacilitiesFactory(supervisedPrograms, user.user_id);
		        }
		    }
		});

	}

})();
