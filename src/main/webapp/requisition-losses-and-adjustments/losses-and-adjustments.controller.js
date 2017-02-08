(function() {

    'use strict';

    angular
        .module('requisition-losses-and-adjustments')
        .controller('LossesAndAdjustmentsController', lossesAndAdjustmentsCtrl);

    lossesAndAdjustmentsCtrl.$inject = ['$scope', '$filter', 'calculationFactory'];

    function lossesAndAdjustmentsCtrl($scope, $filter, calculationFactory) {
        var vm = this;

        vm.lineItem = $scope.lineItem;
        vm.requisition = $scope.requisition;
        vm.adjustments = vm.lineItem.stockAdjustments;
        vm.reasons = vm.requisition.$stockAdjustmentReasons;

        vm.disabled = vm.requisition.$isAuthorized() ||
            vm.requisition.$isApproved() ||
            vm.requisition.$isInApproval();

        vm.addAdjustment = addAdjustment;
        vm.removeAdjustment = removeAdjustment;
        vm.getReasonName = getReasonName;
        vm.getTotal = getTotal;
        vm.recalculateTotal = recalculateTotal;

        function addAdjustment() {
            vm.adjustments.push({
                reasonId: vm.adjustment.reason.id,
                quantity: vm.adjustment.quantity
            });
            vm.adjustment.quantity = undefined;
            vm.adjustment.reason = undefined;
            vm.recalculateTotal();
        }

        function removeAdjustment(adjustment) {
            var index = vm.adjustments.indexOf(adjustment);
            vm.adjustments.splice(index, 1);
            vm.recalculateTotal();
        }

        function getReasonName(reasonId) {
            var reason = $filter('filter')(vm.reasons, {
                id: reasonId}, true
            );

            if (reason && reason.length) {
                return reason[0].name;
            }
        }

        function getTotal() {
            return calculationFactory.totalLossesAndAdjustments(vm.lineItem, vm.reasons);
        }

        function recalculateTotal() {
            vm.lineItem.totalLossesAndAdjustments = vm.getTotal();
        }
    }

})();
