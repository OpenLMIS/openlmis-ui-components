(function() {

	'use strict';

	angular.module('openlmis.requisitions').config(routes);

	routes.$inject = ['$stateProvider', 'RequisitionRights'];

	function routes($stateProvider, RequisitionRights) {

		$stateProvider.state('requisitions.search', {
			showInNavigation: true,
			label: 'link.requisition.view',
			url: '/view',
			controller: 'RequisitionSearchController',
			templateUrl: 'requisitions/requisition-search/requisition-search.html',
			accessRight: [RequisitionRights.REQUISITION_VIEW],
			resolve: {
		        facilityList: function ($q, FacilityFactory) {
		        	var deferred = $q.defer();

		        	FacilityFactory.getAll().then(function(response) {
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
