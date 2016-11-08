(function() {
	
	'use strict';

	angular.module('openlmis.requisitions').config(routes);

	routes.$inject = ['$stateProvider'];

	function routes($stateProvider) {

		$stateProvider.state('requisitions.search', {
			showInNavigation: true,
			label: 'link.requisition.view',
			url: '/view',
			controller: 'RequisitionSearchController',
			templateUrl: 'requisitions/requisition-search/requisition-search.html',
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