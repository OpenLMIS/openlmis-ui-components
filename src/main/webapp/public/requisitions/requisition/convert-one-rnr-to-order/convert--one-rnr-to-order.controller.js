(function() {

    'use strict';

    /**
     * @ngdoc controller
     * @name openlmis.requisitions.ConvertOneRnrToOrderCtrl
     *
     * @description
     * Controller for converting single requisition to order.
     */

    angular
        .module('openlmis.requisitions')
        .controller('ConvertOneRnrToOrderCtrl', convertOneRnrToOrderCtrl);

    convertOneRnrToOrderCtrl.$inject = ['$scope', '$state', 'RequisitionService'];

    function convertOneRnrToOrderCtrl($scope, $state, RequisitionService) {

        var vm = this;

        /**
         * @ngdoc property
         * @name vm.requisitions
         * @propertyOf openlmis.requisitions.ConvertOneRnrToOrderCtrl
         * @type {Object}
         *
         * @description
         * Holds requisitions for convert.
         */
        vm.requisitions = $scope.requisitions;

        /**
         * @ngdoc property
         * @name vm.requisition
         * @propertyOf openlmis.requisitions.ConvertOneRnrToOrderCtrl
         * @type {Object}
         *
         * @description
         * Holds requisition.
         */
        vm.requisition = $scope.requisition;

        // Functions

        vm.convertRnr = convertRnr;
        vm.reloadState = reloadState;

        /**
         * @ngdoc function
         * @name convertRnr
         * @methodOf openlmis.requisitions.ConvertOneRnrToOrderCtrl
         *
         * @description
         * Responsible for converting requisition to order.
         * Displays modal window before conversion.
         */
        function convertRnr() {
            var requisitions = [];
            requisitions.push(vm.requisitionWithDepots);
            RequisitionService.convertToOrder(requisitions).then(vm.reloadState);
        };

        function reloadState() {
            $state.reload();
        }
    }

})();
