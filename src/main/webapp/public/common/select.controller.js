(function(){
    "use strict";

    /**
        *@ngdoc controller
        *@name openlmis-core.controller:SelectController
        *@description
        *Controller for <openlmis-select> directive to assign proper attributes to <ui-select>
        */

    angular.module("openlmis-core").controller("SelectController", SelectController);

    SelectController.$inject = ['$scope','$attrs']
    function SelectController($scope, $attrs) {
        $scope.selected = {};
        if($scope.defaultValue) {
            $scope.selected.item = JSON.parse($scope.defaultValue);
        }
        $scope.ngModel = $scope.selected;
        $scope.searchEnabled = false;

        if ( $scope.items && $scope.items.length > 10) {
            $scope.searchEnabled = true;
        }

    }
})();