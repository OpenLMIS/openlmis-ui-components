(function() {
	
	"use strict";

	angular.module('openlmis', [
		'openlmis-core',
		'openlmis-auth',
		'openlmis-dashboard',
		'rnr', 
		'requisitionGroup', 
		'createRnRTemplate', 
		'resetPassword', 
		'ui.router'
		]);
})();