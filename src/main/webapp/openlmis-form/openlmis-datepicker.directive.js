(function() {

	'use strict';

	/**
     * @ngdoc directive
     * @name openlmis-form.openlmisDatepicker
     *
     * @description
     * Directive allows to add date picker input.
     */
	angular
		.module('openlmis-form')
		.directive('openlmisDatepicker', datepicker);

	function datepicker() {
		var directive = {
			restrict: 'E',
			scope: {
				value: '=',
				inputId: '@?'
			},
			templateUrl: 'openlmis-form/datepicker.html'
		};
		return directive;
	}

})();
