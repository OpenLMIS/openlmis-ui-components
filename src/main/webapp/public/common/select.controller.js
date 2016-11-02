(function(){
    "use strict";

    angular.module("openlmis-core").controller("SelectController", SelectController);

    SelectController.$inject = ['$scope','$attrs']
    function SelectController($scope, $attrs) {
        $scope.selected = {};
        $scope.ngModel = $scope.selected;
        $scope.searchEnabled = false;

        if ( $scope.items && $scope.items.length > 10) {
            $scope.searchEnabled = true;
        }

    }
})();