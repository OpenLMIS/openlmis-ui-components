(function() {

	'use strict';

	angular.module('openlmis.requisitions').config(routes);

	routes.$inject = ['$stateProvider'];

	function routes($stateProvider) {

		$stateProvider.state('requisitions.initRnr', {
			url: '/initialize',
			controller: 'InitiateRnrController',
			templateUrl: 'requisitions/init.html'
		});
	}
})();