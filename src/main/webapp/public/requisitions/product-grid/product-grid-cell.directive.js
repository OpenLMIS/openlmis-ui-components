(function() {
  
  'use strict';

  angular
    .module('openlmis.requisitions')
    .directive('productGridCell', productGridCell);

  productGridCell.$inject = ['$q', '$templateRequest', '$compile', 'LineItemFactory'];

  function productGridCell($q, $templateRequest, $compile, productLineItem) {
    var directive = {
      restrict: 'A',
      require: '^productGrid',
      link: link
    };
    return directive;

    function link(scope, element) {
      $q.all([
        $templateRequest('requisitions/product-grid/' + ((scope.column.source === 'USER_INPUT' && scope.ngModel.status !== "AUTHORIZED") ? 'user-input' : 'read-only') + '-cell.html'),
        $templateRequest('requisitions/product-grid/product-grid-cell-error.html')
      ]).then(
        function(templates) {
          var input = angular.element(templates[0]);
          if (scope.column.columnDefinition.columnType === 'NUMERIC' && scope.column.source === 'USER_INPUT' && scope.ngModel.status !== "AUTHORIZED") {
            input.attr('positive-integer', '');
          }
          element.append($compile(input)(scope));
          element.append($compile(templates[1])(scope));
        }
      );
    }
  }

})();