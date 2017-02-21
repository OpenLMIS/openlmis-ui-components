/*
 * This program is part of the OpenLMIS logistics management information system platform software.
 * Copyright © 2017 VillageReach
 *
 * This program is free software: you can redistribute it and/or modify it under the terms
 * of the GNU Affero General Public License as published by the Free Software Foundation, either
 * version 3 of the License, or (at your option) any later version.
 *  
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY;
 * without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. 
 * See the GNU Affero General Public License for more details. You should have received a copy of
 * the GNU Affero General Public License along with this program. If not, see
 * http://www.gnu.org/licenses.  For additional information contact info@OpenLMIS.org. 
 */

(function() {

    'use strict';

    /**
     * @ngdoc controller
     * @name requisition-losses-and-adjustments.controller:LossesAndAdjustmentsController
     *
     * @description
     * Provides methods for Losses and Adjustments modal.
     */
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

        vm.addAdjustment = addAdjustment;
        vm.removeAdjustment = removeAdjustment;
        vm.getReasonName = getReasonName;
        vm.getTotal = getTotal;
        vm.recalculateTotal = recalculateTotal;
        vm.isDisabled = isDisabled;

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

        /**
         * @ngdoc method
         * @methodOf requisition-losses-and-adjustments.controller:LossesAndAdjustmentsController
         * @name isDisabled
         *
         * @description
         * Checks whether the modal is in disabled state.
         *
         * @return  {Boolean}   true if requisition is authorize/approved/in approval or line item
         *                      is skipped, false otherwise
         */
        function isDisabled() {
            return vm.requisition.$isAuthorized() ||
                vm.requisition.$isApproved() ||
                vm.requisition.$isInApproval() ||
                vm.lineItem.skipped;
        }
    }

})();
