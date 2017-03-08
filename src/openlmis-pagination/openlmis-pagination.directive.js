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
     * @restrict E
     * @name openlmis-pagination.directive:openlmisPagination
     *
     * @description
     * The OpenLMIS-Pagination component provides controls for API endpoints
     * that can provide paginated content. This endpoint allows for methods to
     * add validation for sets of pages.
     *
     * There are two edge-cases that are supported by the OpenLMIS-Pagination
     * component, if there are no results or if a page greater than the total
     * number of pages is selected.
     *
     * @param {Integer} totalItems Stores the total amount of all items.
     * @param {Array} items The list of all items used for extracting pages. If external pagination is used this is a list of items on the current page.
     * @param {Integer} pageSize Number of items on one page.
     * @param {Function} pageValidator Validates whether page with the given name is valid.
     *
     * @example
     * ```
     * <openlmis-pagination
     *   ng-model="vm.stateParams.page"
     *   total-items="100"
     *   items="5"
     *   page-size="10">
     * </openlmis-pagination>
     * ```
     */
	angular
		.module('openlmis-pagination')
		.directive('openlmisPagination', directive);

	function directive() {
		return {
			controller: 'PaginationController',
			controllerAs: 'vm',
			link: link,
			replace: true,
			require: ['openlmisPagination', 'ngModel'],
			restrict: 'E',
			scope: {
				pageValidator: '=',
				totalItems: '=',
				items: '=',
				pageSize: '='
			},
			templateUrl: 'openlmis-pagination/openlmis-pagination.html'
		};

		function link(scope, element, attrs, controllers) {
			var vm = controllers[0],
				ngModelCtrl = controllers[1];

			vm.isPageValid = scope.pageValidator;
			vm.totalItems = scope.totalItems;
			vm.items = scope.items;
			vm.pageSize = scope.pageSize;

			ngModelCtrl.$render = render;

			scope.$watch('vm.page', function(oldPage, newPage) {
				if (oldPage !== newPage) {
					ngModelCtrl.$setViewValue(vm.page);
				}
			});

			scope.$watch('items + totalItems', function() {
				vm.items = scope.items;
				vm.totalItems = scope.totalItems;
			});

			function render() {
				vm.page = ngModelCtrl.$viewValue;
			}
		}
	}

})();
