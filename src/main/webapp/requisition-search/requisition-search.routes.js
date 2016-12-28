(function() {

	'use strict';

	angular.module('requisition-search').config(routes);

	routes.$inject = ['$stateProvider', 'RequisitionRights'];

	function routes($stateProvider, RequisitionRights) {

		$stateProvider.state('requisitions.search', {
			showInNavigation: true,
			label: 'link.requisition.view',
			url: '/view',
			controller: 'RequisitionSearchController',
			templateUrl: 'requisition-search/requisition-search.html',
			accessRights: [
				RequisitionRights.REQUISITION_VIEW
			],
			controllerAs: 'vm',
			resolve: {
		        facilityList: function ($q, FacilityService) {
		        	var deferred = $q.defer();

		        	FacilityService.getAll().then(function(response) {
		        		deferred.resolve(response);
		        	}, function() {
		        		deferred.reject();
		        	});

		        	return deferred.promise;
		        }
		    }
		});

	}

})();
