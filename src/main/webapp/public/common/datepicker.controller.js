(function() {

    'use strict';

    angular
        .module('openlmis-core')
        .controller('DatepickerCtrl', DatepickerCtrl);

    DatepickerCtrl.$inject = ['$scope'];

    function DatepickerCtrl($scope) {

        $scope.isOpened = false;

        $scope.openDatepicker = openDatepicker;

        $scope.dateOptions = {
            formatYear: 'yyyy',
            startingDay: 1
        };

        function openDatepicker() {
            $scope.isOpened = true;
        }

    }
})();