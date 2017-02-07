(function() {

	'use strict';

	/**
     * @ngdoc directive
     * @name openlmis-pagination.openlmisPagination
     *
     * @description
     * Provides pagination for table. Allows to add method for validating pages.
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
