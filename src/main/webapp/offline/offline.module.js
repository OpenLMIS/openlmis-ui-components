(function(){
    'use strict';

	/**
	 *
	 * @module openlmis-offline
	 *
	 * @description
	 * This module contains functionality to support detecting if the browser
	 * is offline or not. This module doesn't direct a specific workflow, but
	 * simply extends [OfflineJS](http://github.hubspot.com/offline/docs/welcome/)
	 * into AngularJS directives and services that are used within the OpenLMIS-UI.
	 *
	 */

    angular.module('openlmis-offline', [
    	'openlmis-config'
    	]);

})();