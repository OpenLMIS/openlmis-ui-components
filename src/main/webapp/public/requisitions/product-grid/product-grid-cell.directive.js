(function() {
  
  'use strict';

  angular
    .module('openlmis.requisitions')
    .directive('productGridCell', productGridCell);

  productGridCell.$inject = ['$templateRequest', '$compile', 'Column', 'Source', 'Type'];

  function productGridCell($templateRequest, $compile, Column, Source, Type) {
    var directive = {
      restrict: 'A',
      require: '^productGrid',
      link: link
    };
    return directive;

    function link(scope, element) {
      var requisition = scope.ngModel,
          column = scope.column;

      scope.isReadOnly = isReadOnly();
      scope.validate = validate;

      $templateRequest('requisitions/product-grid/product-grid-cell.html').then(
        function(template) {
          var cell = angular.element(template);
          if (column.type === Type.NUMERIC && !scope.isReadOnly) {
            cell.find('input').attr('positive-integer', '');
          }
          element.append($compile(cell)(scope));
        }
      );

      angular.forEach(column.dependencies, function(dependency) {
        scope.$watch('lineItem.' + dependency, function(newValue, oldValue) {
          if (newValue !== oldValue) {
            validate();
          }
        });
      });

      function validate() {
        scope.lineItem.$isColumnValid(column);
      }

      function isReadOnly() {
        if (requisition.$isApproved()) return true;
        if (requisition.$isAuthorized()) {
          return [Column.APPROVED_QUANTITY, Column.REMARKS].indexOf(column.name) === -1;
        }
        return column.source !== Source.USER_INPUT;
      }
    }
  }

})();