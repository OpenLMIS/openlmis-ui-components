(function(){
	"use strict";

	/**
	 * @ngdoc interface
     * @name openlmis-offline.Offline
     * @description
     * Creates constant tied to [OfflineJS,](https://github.com/hubspot/offline) so that if OfflineJS isn't included
     * an error message is thrown by AngularJS.
	 * 
	 */

	angular.module('openlmis-offline')
		.constant('Offline', Offline);

})();