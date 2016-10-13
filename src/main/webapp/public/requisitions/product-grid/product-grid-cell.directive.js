(function() {
  
  'use strict';

  angular.module('openlmis.requisitions')
    .directive('productGridCell', productGridCell);

  productGridCell.$inject = ['$compile'];

  function productGridCell($compile) {

    function determineType(column) {
      if (column.columnDefinition.type === 'String') {
        return 'text';
      }
      return 'number';
    }

    return {
      restrict: 'E',
      replace: true,
      scope: {
        ngModel: '=',
        col: '='
      },
      link: function(scope, element) {
        var cell = angular.element('<div>');
        cell.addClass('ui-grid-cell-contents');

        if (scope.col.source === 'USER_INPUT') {
          var input = angular.element('<input>');
          input.attr('type', determineType(scope.col));
          input.attr('ng-model', 'ngModel');
          cell.append(input);
        } else {
          cell.text('{{ngModel}}');
        }
        
        element.replaceWith($compile(cell)(scope));
      }
    }
  }

})();