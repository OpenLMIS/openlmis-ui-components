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
			restrict: 'E',
			scope: {
				isPageValid: '=',
				numberOfPages: '=',
				currentPage: '='
			},
			templateUrl: 'openlmis-pagination/openlmis-pagination.html',
			controller: 'PaginationController',
			link: link
		};

		function link(scope, element, attributes, controller) {
			scope.currentPage = 1;
		}
	}

})();
