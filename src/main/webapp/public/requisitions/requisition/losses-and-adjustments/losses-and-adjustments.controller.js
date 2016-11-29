(function() {

    'use strict';

    angular
        .module('openlmis.requisitions')
        .controller('LossesAndAdjustmentsCtrl', lossesAndAdjustmentsCtrl);

    lossesAndAdjustmentsCtrl.$inject = ['$scope', '$filter', 'calculations'];

    function lossesAndAdjustmentsCtrl($scope, $filter, calculations) {
        var vm = this;

        vm.lineItem = $scope.lineItem;
        vm.requisition = $scope.requisition;
        vm.adjustments = vm.lineItem.stockAdjustments;

        vm.requisition.$getStockAdjustmentReasons().then(function(stockAdjustmentReasons) {
            vm.reasons = stockAdjustmentReasons;
        });

        vm.addAdjustment = updateValue(addAdjustment);
        vm.removeAdjustment = updateValue(removeAdjustment);
        vm.getReasonName = getReasonName;
        vm.getTotal = getTotal;

        function addAdjustment() {
            vm.adjustments.push({
                reasonId: vm.adjustment.reason.item.id,
                quantity: vm.adjustment.quantity
            });
            vm.adjustment.quantity = undefined;
            vm.adjustment.reason.item = undefined;
        }

        function removeAdjustment(adjustment) {
            var index = vm.adjustments.indexOf(adjustment);
            vm.adjustments.splice(index, 1);

        }

        function getReasonName(reasonId) {
            var reason = $filter('filter')(vm.reasons, {
                id: reasonId}, true
            );

            if (reason && reason.length) {
                return reason[0].name;
            }
        }

        function updateValue(before) {
            return function() {
                before();
                vm.lineItem.totalLossesAndAdjustments = getTotal();
            };
        }

        function getTotal() {
            return calculations.totalLossesAndAdjustments(vm.lineItem, vm.reasons);
        }
    }

})();
