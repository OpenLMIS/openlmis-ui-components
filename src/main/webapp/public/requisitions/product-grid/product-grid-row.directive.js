(function() {

  'use strict';

  angular
    .module('openlmis.requisitions')
    .directive('productGridRow', productGridRow);

  function productGridRow() {
    var directive = {
      restrict: 'A',
      require: '^productGrid',
      templateUrl: 'requisitions/product-grid/product-grid-row.html',
      link: link
    };
    return directive;

    function link(scope, element, attrs, gridCtrl) {
      if (scope.$index === 0 || productCategoryChanged()) {
        scope.productCategory = getProductCategory(scope.lineItem);
      }

      function productCategoryChanged() {
        return getProductCategory(scope.lineItem) !== getProductCategory(getPreviousLineItem());
      }

      function getProductCategory(lineItem) {
        return lineItem.orderableProduct.programs[0].productCategoryDisplayName;
      }

      function getPreviousLineItem() {
        return scope.sortedLineItems[scope.$index - 1];
      }
    }
  }

})();