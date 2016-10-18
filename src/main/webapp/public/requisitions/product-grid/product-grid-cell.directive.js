(function() {
  
  'use strict';

  angular
    .module('openlmis.requisitions')
    .directive('productGridCell', productGridCell);

  productGridCell.$inject = ['$templateRequest', '$compile', 'productLineItem'];

  function productGridCell($templateRequest, $compile, productLineItem) {
    var directive = {
      restrict: 'A',
      replace: true,
      require: '^productGrid',
      link: link
    };
    return directive;

    function link(scope, element) {
      var row = scope.row.entity,
          colName = scope.col.name,
          source = scope.col.colDef.cellSource;

      scope.getReadOnlyValue = function() {
        return row[colName] = productLineItem.evaluate(row, colName, source === 'CALCULATED');
      };

      $templateRequest('requisitions/product-grid/' + (source === 'USER_INPUT' ? 'user-input' : 'read-only') + '-cell.html').then(
        function(template) {
          element.append($compile(template)(scope));
        }
      );
    }
  }

})();