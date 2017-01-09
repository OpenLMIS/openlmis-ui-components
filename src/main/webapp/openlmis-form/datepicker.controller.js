(function() {

    'use strict';

    /**
     * @ngdoc controller
     * @name openlmis-form.controller:SelectController
     *
     * @description
     * Controller for <openlmis-datepicker> directive
     */
    angular
        .module('openlmis-form')
        .controller('DatepickerController', controller);

    controller.$inject = ['$scope'];

    function controller($scope) {

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
