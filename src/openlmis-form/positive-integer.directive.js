/*
 * This program is part of the OpenLMIS logistics management information system platform software.
 * Copyright © 2017 VillageReach
 *
 * This program is free software: you can redistribute it and/or modify it under the terms
 * of the GNU Affero General Public License as published by the Free Software Foundation, either
 * version 3 of the License, or (at your option) any later version.
 *  
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY;
 * without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. 
 * See the GNU Affero General Public License for more details. You should have received a copy of
 * the GNU Affero General Public License along with this program. If not, see
 * http://www.gnu.org/licenses.  For additional information contact info@OpenLMIS.org. 
 */

(function() {

	'use strict';

	/**
	 * @ngdoc directive
	 * @restrict A
	 * @name openlmis-form.directive:positiveInteger
	 *
	 * @description
	 * Restricts the ngModel to only allow positive integers.
	 *
	 * @example
	 * Extend the input element to force it to only accept positive integers as values.
	 * ```
	 * <input ng-model="someModel" positive-integer>
	 * ```
	 */
	angular
		.module('openlmis-form')
		.directive('positiveInteger', positiveInteger);

	function positiveInteger() {
		var directive = {
			require: 'ngModel',
			link: link
		};
		return directive;

		function link(scope, element, attrs, modelCtrl) {

			element.attr('type', 'text');
			element.addClass('number');

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
