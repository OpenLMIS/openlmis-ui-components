(function() {

  'use strict';

  angular
    .module('openlmis.requisitions')
    .controller('ProductGridCtrl', productGridCtrl)
    .filter('numberFilter', numberFilter);

  productGridCtrl.$inject = ['$scope', 'messageService'];

  function productGridCtrl($scope, messageService) {
    $scope.ngModel.$getTemplate().then(function(template) {
      var columnDefs = [{
        field: 'orderableProduct.productCode',
        displayName: messageService.get('label.vaccine.manufacturer.product.code'),
        pinnedLeft: true
      }, {
        field: 'orderableProduct.name',
        displayName: messageService.get('option.value.product'),
        pinnedLeft: true
      }];
        
      for (var column in template.columnsMap) {
        var columnDef = template.columnsMap[column];
        columnDefs.push({
          field: column,
          displayName: column.name,
          cellFilter: 'numberFilter',
          cellSource: columnDef.source,
          cellType: columnDef.columnDefinition.columnType,
          cellTemplate: 'requisitions/product-grid/product-grid-cell.html'
        });
      }

      $scope.options = {
        data: $scope.ngModel.requisitionLineItems,
        showFooter: false,
        showSelectionCheckbox: false,
        enableColumnResize: true,
        enableColumnMenus: false,
        sortInfo: { fields: ['submittedDate'], directions: ['asc'] },
        showFilter: false,
        columnDefs: columnDefs
      };
    }).finally(function() {
      $scope.templateLoaded = true;
    });
  }

  function numberFilter() {
    return function(value) {
      return (value === null ? 0 : value);
    };
  }

})();