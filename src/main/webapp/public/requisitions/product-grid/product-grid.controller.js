(function() {

  'use strict';

  angular
    .module('openlmis.requisitions')
    .controller('ProductGridCtrl', productGridCtrl);

  productGridCtrl.$inject = ['$scope'];

  function productGridCtrl($scope) {

    $scope.ngModel.$getColumnTemplates().then(function(columnTemplates) {
      $scope.columns = columnTemplates;
    }).finally(function() {
      $scope.templateLoaded = true;
    });

  }

})();