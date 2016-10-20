(function() {

	'use strict';

	angular.module('openlmis.requisitions').config(routes);

	routes.$inject = ['$stateProvider'];

	function routes($stateProvider) {

		$stateProvider.state('requisitions.initRnr', {
			url: '/initialize',
			controller: 'InitiateRnrController',
			templateUrl: 'requisitions/init.html',
			resolve: {
				facility: function (AuthorizationService, $q) {
				  	var deferred = $q.defer();

					AuthorizationService.getDetailedUser().$promise.then(function(response) {
					    deferred.resolve(response.homeFacility);
				    }, function(response) {
				      	alert('Cannot find user info');
				      	deferred.reject();
				  	});

					return deferred.promise;
				}
      		}
		});
	}
})();