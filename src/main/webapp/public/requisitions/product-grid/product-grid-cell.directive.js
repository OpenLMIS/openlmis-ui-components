(function() {
  
  'use strict';

  angular
    .module('openlmis.requisitions')
    .directive('productGridCell', productGridCell);

  productGridCell.$inject = ['$q', '$templateRequest', '$compile', 'productLineItem', 'productLineItemValidator'];

  function productGridCell($q, $templateRequest, $compile, productLineItem, productLineItemValidator) {
    var directive = {
      restrict: 'A',
      require: '^productGrid',
      link: link
    };
    return directive;

    function link(scope, element, attrs, gridCtrl) {
      var row = scope.row.entity,
          colName = scope.col.name,
          source = scope.col.colDef.cellSource;

      scope.getReadOnlyValue = function() {
        return row[colName] = productLineItem.evaluate(row, colName, source === 'CALCULATED');
      };

      scope.getError = function() {
        return scope.error = gridCtrl.setError(scope.row.uid, colName, productLineItemValidator.validate(row, colName, scope.col.displayName));
      }

      $q.all([
        $templateRequest('requisitions/product-grid/' + (source === 'USER_INPUT' ? 'user-input' : 'read-only') + '-cell.html'),
        $templateRequest('requisitions/product-grid/product-grid-cell-error.html')
      ]).then(
        function(templates) {
          angular.forEach(templates, function(template) {
            element.append($compile(template)(scope));
          });
        }
      );
    }
  }

})();