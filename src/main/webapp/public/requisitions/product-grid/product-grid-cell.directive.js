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
      var editable = isEditable(scope);
      $q.all([
        $templateRequest('requisitions/product-grid/' + (editable ? 'user-input' : 'read-only') + '-cell.html'),
        $templateRequest('requisitions/product-grid/product-grid-cell-error.html')
      ]).then(
        function(templates) {
          var input = angular.element(templates[0]);
          if (scope.column.columnDefinition.columnType === 'NUMERIC' && scope.column.source === 'USER_INPUT' && editable) {
            input.attr('positive-integer', '');
          }
          element.append($compile(input)(scope));
          element.append($compile(templates[1])(scope));
        }
      );
    }

    function isEditable(scope) {
      var editable = scope.column.source === 'USER_INPUT' ? true : false;
      switch (scope.ngModel.status) {
        case "AUTHORIZED":
          if (scope.column.name === "approvedQuantity" || scope.column.name === "remarks") {
            editable = true;
          } else {
            editable = false;
          }
          break;
        case "APPROVED":
          editable = false;
      }
      return editable;
    }
  }

})();