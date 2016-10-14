(function() {
  
  'use strict';

  angular.module('openlmis.requisitions')
    .directive('productGridCell', productGridCell);

  productGridCell.$inject = ['$q', '$templateRequest', '$compile'];

  function productGridCell($q, $templateRequest, $compile) {
    return {
      restrict: 'E',
      replace: true,
      scope: {
        ngModel: '=',
        col: '='
      },
      link: function(scope, element) {
        scope.determineType = function() {
          if (scope.col.columnDefinition.type === 'String') {
            return 'text';
          }
          return 'number';
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