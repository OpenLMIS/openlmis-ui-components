(function() {
	
	'use strict';

	angular
		.module('openlmis.requisitions')
		.directive('productGrid', productGrid);

	function productGrid() {
		var directive = {
			restrict: 'EA',
			scope: {
				ngModel: '='
			},
			templateUrl: 'requisitions/product-grid/product-grid.html',
			controller: 'ProductGridCtrl'
		};
		return directive;
	}

})();