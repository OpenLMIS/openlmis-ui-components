(function() {
	
	'use strict';

	angular
		.module('openlmis-core')
		.directive('openlmisDatepicker', datepicker);

	function datepicker() {
		var directive = {
			restrict: 'EA',
			scope: {
				value: '='
			},
			templateUrl: 'common/datepicker.html',
			controller: 'DatepickerCtrl'
		};
		return directive;
	}

})();