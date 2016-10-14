(function() {
  
  'use strict';

  angular.module('openlmis.requisitions')
    .directive('productGridCell', productGridCell);

  productGridCell.$inject = ['$q', '$templateRequest', '$compile', 'productGridCellValue'];

  function productGridCell($q, $templateRequest, $compile, productGridCellValue) {
    return {
      restrict: 'E',
      replace: true,
      scope: {
        ngModel: '=',
        col: '='
      },
      link: function(scope, element) {
        var row = scope.ngModel;

        scope.getReadOnlyValue = function() {
          return row[scope.col.columnDefinition.name] = productGridCellValue.evaluate(row, scope.col);
        };

        $q.all([
          $templateRequest('requisitions/product-grid/product-grid-cell.html'),
          $templateRequest('requisitions/product-grid/' + (scope.col.source === 'USER_INPUT' ? 'user-input' : 'read-only') + '-cell.html')
        ]).then(
          function(templates) {
            var cell = angular.element(templates[0]);
            cell.append(templates[1]);
            element.replaceWith($compile(cell)(scope));
          }
        );
      }
    }
  }

})();