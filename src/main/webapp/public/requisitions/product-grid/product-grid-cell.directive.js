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

	productGridCell.$inject = ['$q', '$templateRequest', '$compile', 'Column', 'Source', 'Type'];

	function productGridCell($q, $templateRequest, $compile, Column, Source, Type) {
		var directive = {
			restrict: 'A',
			require: '^productGrid',
			link: link
		};
		return directive;

		function link(scope, element) {
			var requisition = scope.ngModel,
					column = scope.column;

			scope.isReadOnly = isReadOnly();
			scope.validate = validate;

			$q.all([
				$templateRequest('requisitions/product-grid/product-grid-cell.html'),
				$templateRequest('requisitions/product-grid/product-grid-adjustment-cell.html')
			]).then(
				function (templates) {
					if (!isLossesAndAdjustmentCell(scope) || scope.isReadOnly) {
						var cell = angular.element(templates[0]);
						if (column.type === Type.NUMERIC && !scope.isReadOnly) {
							cell.find('input').attr('positive-integer', '');
						}
						element.append($compile(cell)(scope));
					} else {
						element.append($compile(templates[1])(scope));
					}
				}
			);

			angular.forEach(column.dependencies, function(dependency) {
				scope.$watch('lineItem.' + dependency, function(newValue, oldValue) {
					if (newValue !== oldValue) {
						validate();
					}
				});
			});

			function validate() {
				scope.lineItem.$isColumnValid(column, scope.columns);
			}

			function isReadOnly() {
				if (requisition.$isApproved()) return true;
				if (requisition.$isAuthorized()) {
					return [Column.APPROVED_QUANTITY, Column.REMARKS].indexOf(column.name) === -1;
				}
				return column.source !== Source.USER_INPUT;
			}

			function isLossesAndAdjustmentCell(scope) {
				return scope.column.name === 'totalLossesAndAdjustments' ? true : false;
			}
		}
	}

})();