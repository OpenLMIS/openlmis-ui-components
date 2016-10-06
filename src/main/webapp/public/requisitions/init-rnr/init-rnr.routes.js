(function() {

	'use strict';

	angular.module('openlmis.requisitions').config(routes);

	routes.$inject = ['$stateProvider'];

	function routes($stateProvider) {

		$stateProvider.state('requisitions.initRnr', {
			url: '/requisition/init-rnr',
			controller: 'InitiateRnrController',
			templateUrl: 'requisitions/init-rnr/init.html'
		});
	}
})();