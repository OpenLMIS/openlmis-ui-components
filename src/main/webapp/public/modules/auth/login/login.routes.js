(function() {
	
	"use strict";

	angular.module('openlmis.auth').config(config);

	config.$inject = ['$stateProvider'];

	function config($stateProvider) {

		$stateProvider.state('app.login', {
		    url: '/login',
		    views: {
		      'header@': {},
		      '': {
		        templateUrl: 'modules/auth/login/login.html',
		        controller: 'LoginController'
		      },
		      'navigation@':{}
		    }
		    
		});

	}

})();