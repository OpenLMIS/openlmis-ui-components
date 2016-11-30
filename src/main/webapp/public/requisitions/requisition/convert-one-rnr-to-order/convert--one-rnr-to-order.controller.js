(function() {

    'use strict';

    angular
        .module('openlmis.requisitions')
        .controller('ConvertOneRnrToOrderCtrl', convertOneRnrToOrderCtrl);

    convertOneRnrToOrderCtrl.$inject = ['$scope', '$filter', '$state', 'FacilityFactory',
                                  'RequisitionService'];

    function convertOneRnrToOrderCtrl($scope, $filter, $state, FacilityFactory,
        RequisitionService) {
        var vm = this;

        vm.requisition = $scope.requisition;
        vm.facilities = $scope.facilities;
        //$filter('filter')($scope.requisitions, { requisition: vm.rnr })[0];
        vm.convertRnr = convertRnr;
        vm.reloadState = reloadState;

        /**
         * @ngdoc function
         * @name convertRnr
         * @methodOf openlmis.requisitions.RequisitionCtrl
         *
         * @description
         * Responsible for converting requisition to order.
         * Displays modal window before conversion.
         * If an error occurs during converting it will display an error notification modal.
         * Otherwise, a success notification modal will be shown.
         */
        function convertRnr() {
            var requisitions = [];
            requisitions.push({requisition: vm.requisition});
            RequisitionService.convertToOrder(requisitions).then(vm.reloadState);
        };

        function reloadState() {
            $state.reload();
        }
    }

})();
