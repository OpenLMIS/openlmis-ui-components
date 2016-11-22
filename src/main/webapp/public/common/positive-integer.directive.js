(function() {

	'use strict';

	/**
	 * @ngdoc directive
	 * @name openlmis-core.directive:positiveInteger
	 *
	 * @description
	 * Restricts the ngModel to only allow positive interegers.
	 *
	 * @example
	 * Extend the input element to force it to only accept positive integers as values.
	 * ```
	 * <input ng-model="someModel" positive-integer>
	 * ```
	 */
	angular
		.module('openlmis-core')
		.directive('positiveInteger', positiveInteger);

	function positiveInteger() {
		var directive = {
			require: 'ngModel',
			link: link
		};
		return directive;

		function link(scope, element, attrs, modelCtrl) {
			modelCtrl.$parsers.push(function (inputValue) {

				if (inputValue == undefined) return ''
				var transformedInput = inputValue.replace(/[^0-9]/g, '');
				if (transformedInput!=inputValue) {
					modelCtrl.$setViewValue(transformedInput);
					modelCtrl.$render();
				}

				return transformedInput ? parseInt(transformedInput) : null;
			});
		}
	}
})();
