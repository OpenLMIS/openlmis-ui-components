(function() {

	'use strict';

	/**
	 * @ngdoc directive
	 * @name requisition-product-grid.productGridCell
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
		.module('requisition-product-grid')
		.directive('productGridCell', productGridCell);

	productGridCell.$inject = ['$q', '$templateRequest', '$compile', 'requisitionValidator',
							   'TEMPLATE_COLUMNS', 'Source', 'Type'];

	function productGridCell($q, $templateRequest, $compile, requisitionValidator, TEMPLATE_COLUMNS,
							 Source, Type) {

    	var directive = {
      		restrict: 'A',
			replace: false,
      		link: link,
			scope: {
				requisition: '=',
				column: '=',
				lineItem: '='
			}
    	};
    	return directive;

    	function link(scope, element) {
      		var requisition = scope.requisition,
          		column = scope.column;

			scope.isReadOnly = isReadOnly();
			scope.validate = validate;
			scope.isTotalLossesAndAdjustments = isTotalLossesAndAdjustments(column);
			scope.isSkipped = column.name === TEMPLATE_COLUMNS.SKIPPED;
			scope.canNotSkip = canNotSkip;


			$templateRequest('requisition-product-grid/product-grid-cell.html').then(function(template) {
				var cell = angular.element(template);
				if (column.type === Type.NUMERIC && !scope.isReadOnly) {
					cell.find('input').attr('positive-integer', '');
				}
				element.replaceWith($compile(cell)(scope));
			});

	      	angular.forEach(column.dependencies, function(dependency) {
	        	scope.$watch('lineItem.' + dependency, function(newValue, oldValue) {
	          		if (newValue !== oldValue) {
						if (column.source === Source.CALCULATED) {
							scope.lineItem.updateFieldValue(column, requisition);
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
					return [
						TEMPLATE_COLUMNS.APPROVED_QUANTITY, TEMPLATE_COLUMNS.REMARKS
					].indexOf(column.name) === -1;
				}
				return column.source !== Source.USER_INPUT;
			}

			function isTotalLossesAndAdjustments(column) {
				return column.name === TEMPLATE_COLUMNS.TOTAL_LOSSES_AND_ADJUSTMENTS;
			}

			function canNotSkip() {
				return !(scope.lineItem.canBeSkipped(scope.requisition));
            }
		}
	}

})();
