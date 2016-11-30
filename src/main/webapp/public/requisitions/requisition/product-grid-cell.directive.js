(function() {

	'use strict';

	/**
	 * @ngdoc directive
	 * @name openlmis.requisitions.productGridCell
	 *
	 * @description
	 * Responsible for rendering the product grid cell based on the column source and requisitions type.
	 * It also keeps track of the validation as well as changes made to the related cells.
	 *
	 * @example
	 * Here we extend our product grid cell with the directive.
	 * ```
	 * <td ng-repeat="column in visibleColumns | orderBy : 'displayOrder'" product-grid-cell></td>
	 * ```
	 */
	angular
		.module('openlmis.requisitions')
		.directive('productGridCell', productGridCell);

	productGridCell.$inject = ['$q', '$templateRequest', '$compile', 'requisitionValidator', 'Columns',
							   'Source', 'Type'];

	function productGridCell($q, $templateRequest, $compile, requisitionValidator, Columns, Source,
							 Type) {

    	var directive = {
      		restrict: 'A',
			replace: true,
			templateUrl: 'requisitions/requisition/product-grid-cell.html',
      		link: link
    	};
    	return directive;

    	function link(scope, element) {
      		var requisition = scope.requisition,
          		column = scope.column;

			scope.isReadOnly = isReadOnly();
			scope.validate = validate;
			scope.isTotalLossesAndAdjustments = isTotalLossesAndAdjustments(column);

			if (column.type === Type.NUMERIC && !scope.isReadOnly) {
				element.find('input').attr('positive-integer', '');
			}

	      	angular.forEach(column.dependencies, function(dependency) {
	        	scope.$watch('lineItem.' + dependency, function(newValue, oldValue) {
	          		if (newValue !== oldValue) {
						if (column.source === Source.CALCULATED) {
							scope.lineItem.updateFieldValue(column, requisition.status);
						}
	            		validate();
	          		}
	        	});
	      	});

      		function validate() {
				requisitionValidator.validateLineItemField(scope.lineItem, column, scope.requisition.$template.columns);
      		}

			function isReadOnly() {
				if (requisition.$isApproved()) return true;
				if (requisition.$isAuthorized()) {
					return [Columns.APPROVED_QUANTITY, Columns.REMARKS].indexOf(column.name) === -1;
				}
				return column.source !== Source.USER_INPUT;
			}

			function isTotalLossesAndAdjustments(column) {
				return column.name === Columns.TOTAL_LOSSES_AND_ADJUSTMENTS;
			}
		}
	}

})();
