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

	productGridCell.$inject = [
		'$q', '$templateRequest', '$compile', 'requisitionValidator', 'TEMPLATE_COLUMNS',
		'COLUMN_SOURCES', 'COLUMN_TYPES'
	];

	function productGridCell($q, $templateRequest, $compile, requisitionValidator, TEMPLATE_COLUMNS,
							 COLUMN_SOURCES, COLUMN_TYPES) {

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
			scope.isCurrency = isCurrency(column);
			scope.isSkipped = column.name === TEMPLATE_COLUMNS.SKIPPED;
			scope.canNotSkip = canNotSkip;

			$templateRequest('requisition-product-grid/product-grid-cell.html').then(function(template) {
				var cell = angular.element(template);
				if (column.$type === COLUMN_TYPES.NUMERIC && !scope.isReadOnly) {
					cell.find('input').attr('positive-integer', '');
				}
				if(!column.$canChangeOrder) cell.addClass('sticky');
				element.replaceWith($compile(cell)(scope));
			});

			angular.forEach(column.$dependencies, function (depencency) {
				watchDependency(depencency, column);
			});

      		function validate() {
				requisitionValidator.validateLineItemField(
					scope.lineItem,
					column,
					requisition.template.columnsMap,
					requisition
				);
      		}

			function isReadOnly() {
				if (requisition.$isApproved() || requisition.$isReleased()) return true;
				if (requisition.$isAuthorized()) {
					return [
						TEMPLATE_COLUMNS.APPROVED_QUANTITY, TEMPLATE_COLUMNS.REMARKS
					].indexOf(column.name) === -1;
				}
				return column.source !== COLUMN_SOURCES.USER_INPUT;
			}

			function isTotalLossesAndAdjustments(column) {
				return column.name === TEMPLATE_COLUMNS.TOTAL_LOSSES_AND_ADJUSTMENTS;
			}

			function isCurrency(column) {
				return column.$type === COLUMN_TYPES.CURRENCY;
			}

			function canNotSkip() {
				return !(scope.lineItem.canBeSkipped(scope.requisition));
            }

			function watchDependency(name, column) {
				var dependent = requisition.template.getColumn(name);
				if (dependent.$display) {
					scope.$watch('lineItem.' + name, function(newValue, oldValue) {
		          		if (newValue !== oldValue) {
							if (column.source === COLUMN_SOURCES.CALCULATED) {
								scope.lineItem.updateFieldValue(column, requisition);
							}
		            		validate();
		          		}
		        	});
				} else {
					angular.forEach(dependent.$dependencies, function (dependency) {
						watchDependency(dependency, dependent);
					});
				}
			}
		}
	}

})();
