(function() {

  'use strict';

  angular
    .module('openlmis.requisitions')
    .controller('ProductGridCtrl', productGridCtrl);

  productGridCtrl.$inject = ['$scope'];

  function productGridCtrl($scope) {

    function displayColumn(name) {
      if (name != 'remarks' && name != 'approvedQuantity') {
        return true;
      } else if ($scope.ngModel.status == 'AUTHORIZED' || $scope.ngModel.status == 'APPROVED') {
        return true;
      }
      return false;
    }

    $scope.ngModel.$getTemplate().then(function(template) {
      $scope.columns = [];
      angular.forEach(template.columnsMap, function(column) {
        if (displayColumn(column.name)) {
          $scope.columns.push(column);
        }
      });
    }).finally(function() {
      $scope.templateLoaded = true;
    });

  }

})();