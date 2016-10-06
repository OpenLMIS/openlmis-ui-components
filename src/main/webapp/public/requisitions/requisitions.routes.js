(function() {

	'use strict';
	
	angular.module('openlmis.requisitions').config(config);

	config.$inject = ['$stateProvider'];
	function config($stateProvider) {

		$stateProvider.state('requisitions', {
			abstract: true,
			url: '/requisitions',
			template: '<div ui-view></div>'
		});
	}

})();