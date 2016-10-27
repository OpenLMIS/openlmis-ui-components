(function(){
	"use strict";

	// throws error if bootbox isn't loaded in stack
	angular.module('openlmis-core')
		.constant('bootbox', bootbox);

})();