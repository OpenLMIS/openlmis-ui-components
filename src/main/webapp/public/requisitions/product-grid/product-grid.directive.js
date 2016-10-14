(function() {
  
  'use strict';

  angular.module('openlmis.requisitions').directive('productGrid', productGrid)
    .filter('numberFilter', numberFilter);

  productGrid.$inject = ['messageService'];

  function productGrid(messageService) {
    return {
      restrict: 'E',
      scope: {
        columns: '=columns',
        products: '=products'
      },
      templateUrl: 'requisitions/product-grid/product-grid.html',
      link: function(scope) {

        var columnDefs = [{
          field: 'orderableProduct.productCode',
          displayName: messageService.get('label.vaccine.manufacturer.product.code'),
          pinnedLeft: true
        }, {
          field: 'orderableProduct.name',
          displayName: messageService.get('option.value.product'),
          pinnedLeft: true
        }];
        
        for (var column in scope.columns) {
          columnDefs.push({
            field: column,
            displayName: column.name,
            cellFilter: 'numberFilter',
            cellTemplate: '<product-grid-cell ng-model="row.entity" col="grid.appScope.columns[col.field]"></product-grid-cell>'
          });
        }

        scope.options = {
          data: scope.products,
          showFooter: false,
          showSelectionCheckbox: false,
          enableColumnResize: true,
          enableColumnMenus: false,
          sortInfo: { fields: ['submittedDate'], directions: ['asc'] },
          showFilter: false,
          columnDefs: columnDefs
        };

      }
    };
  }

  function numberFilter() {
    return function(value) {
      return (value === null ? 0 : value);
    };
  }

})();