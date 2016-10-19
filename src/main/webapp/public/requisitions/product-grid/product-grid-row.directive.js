(function() {

  'use strict';

  angular
    .module('openlmis.requisitions')
    .directive('productGridRow', productGridRow);

  productGridRow.$inject = ['productLineItemValidator'];

  function productGridRow(productLineItemValidator) {
    var directive = {
      restrict: 'A',
      require: '^productGrid',
      link: link
    };
    return directive;

    function link(scope, element, attrs, gridCtrl) {
      scope.hasErrors = function() {
        return gridCtrl.rowHasErrors(scope.row.uid);
      }
    }
  }

})();