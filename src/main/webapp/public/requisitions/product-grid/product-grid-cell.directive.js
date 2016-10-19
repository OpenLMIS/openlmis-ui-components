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
        $templateRequest('requisitions/product-grid/' + (scope.column.source === 'USER_INPUT' ? 'user-input' : 'read-only') + '-cell.html'),
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