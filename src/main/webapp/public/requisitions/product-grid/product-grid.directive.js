(function() {
  
  'use strict';

  angular.module('openlmis.requisitions').directive('productGrid', productGrid);

  function productGrid() {
    return {
      restrict: 'E',
      replace: true,
      scope: {
        columns: '=columns',
        products: '=products'
      },
      templateUrl: 'requisitions/product-grid/product-grid.html',
      link: function(scope) {
        scope.fixedColumns = {
          'productCode': {
            label: 'Product Code'
          },
          'name': {
            label: 'Product'
          }
        }
        scope.showCategory = function (index) {
          return !((index > 0 ) && (scope.products[index].orderableProduct.productCategory == scope.products[index - 1].orderableProduct.productCategory));
        };
      }
    };
  }

})();