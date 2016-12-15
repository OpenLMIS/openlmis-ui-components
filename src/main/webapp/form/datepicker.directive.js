(function() {
	
	'use strict';

	/**
      	* 
      	* @ngdoc directive
      	* @name openlmis-core.openlmisDatepicker
      	* @description
      	* Directive allows to add date picker input .
     	*
      	*/

	angular
		.module('openlmis-form')
		.directive('openlmisDatepicker', datepicker);

	function datepicker() {
		var directive = {
			restrict: 'EA',
			scope: {
				value: '=',
				inputId: '@?'
			},
			templateUrl: 'form/datepicker.html',
			controller: 'DatepickerCtrl'
		};
		return directive;
	}

})();