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
        .controller('LossesAndAdjustmentsController', lossesAndAdjustmentsController);

    lossesAndAdjustmentsController.$inject = ['$scope', '$filter', 'calculationFactory'];

    function lossesAndAdjustmentsController($scope, $filter, calculationFactory) {
        var vm = this;

        /**
         * @ngdoc property
         * @propertyOf requisition-losses-and-adjustments.controller:LossesAndAdjustmentsController
         * @name lineItem
         * @type {Object}
         *
         * @description
         * Reference to requisition line item that we are updating.
         */
        vm.lineItem = $scope.lineItem;

        /**
         * @ngdoc property
         * @propertyOf requisition-losses-and-adjustments.controller:LossesAndAdjustmentsController
         * @name requisition
         * @type {Object}
         *
         * @description
         * Reference to requisition that we are updating.
         */
        vm.requisition = $scope.requisition;

        /**
         * @ngdoc property
         * @propertyOf requisition-losses-and-adjustments.controller:LossesAndAdjustmentsController
         * @name adjustments
         * @type {Object}
         *
         * @description
         * Line item adjustments that will be updated.
         */
        vm.adjustments = vm.lineItem.stockAdjustments;

        /**
         * @ngdoc property
         * @propertyOf requisition-losses-and-adjustments.controller:LossesAndAdjustmentsController
         * @name reasons
         * @type {Object}
         *
         * @description
         * Possible reasons that user can choose from.
         */
        vm.reasons = vm.requisition.$stockAdjustmentReasons;

        vm.addAdjustment = addAdjustment;
        vm.removeAdjustment = removeAdjustment;
        vm.getReasonName = getReasonName;
        vm.getTotal = getTotal;
        vm.recalculateTotal = recalculateTotal;
        vm.isDisabled = isDisabled;

        /**
         * @ngdoc method
         * @methodOf requisition-losses-and-adjustments.controller:LossesAndAdjustmentsController
         * @name addAdjustment
         *
         * @description
         * Adds adjustment to line item.
         */
        function addAdjustment() {
            vm.adjustments.push({
                reasonId: vm.adjustment.reason.id,
                quantity: vm.adjustment.quantity
            });
            vm.adjustment.quantity = undefined;
            vm.adjustment.reason = undefined;
            vm.recalculateTotal();
        }

        /**
         * @ngdoc method
         * @methodOf requisition-losses-and-adjustments.controller:LossesAndAdjustmentsController
         * @name removeAdjustment
         *
         * @description
         * Removes adjustment to line item.
         */
        function removeAdjustment(adjustment) {
            var index = vm.adjustments.indexOf(adjustment);
            vm.adjustments.splice(index, 1);
            vm.recalculateTotal();
        }

        /**
         * @ngdoc method
         * @methodOf requisition-losses-and-adjustments.controller:LossesAndAdjustmentsController
         * @name getReasonName
         *
         * @description
         * Returns reason name by given reason id.
         *
         * @param  {String} reasonId reason UUID
         * @return {String}          reason name
         */
        function getReasonName(reasonId) {
            var reason = $filter('filter')(vm.reasons, {
                id: reasonId}, true
            );

            if (reason && reason.length) {
                return reason[0].name;
            }
        }

        /**
         * @ngdoc method
         * @methodOf requisition-losses-and-adjustments.controller:LossesAndAdjustmentsController
         * @name getTotal
         *
         * @description
         * Calculates total losses and adjustments for line item.
         *
         * @return {Number} total value of losses and adjustments
         */
        function getTotal() {
            return calculationFactory.totalLossesAndAdjustments(vm.lineItem, vm.reasons);
        }

        /**
         * @ngdoc method
         * @methodOf requisition-losses-and-adjustments.controller:LossesAndAdjustmentsController
         * @name recalculateTotal
         *
         * @description
         * Recalculates total losses and adjustments for line item.
         */
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
         * @return {Boolean} true if requisition is authorize/approved/in approval/released or line item
         *                   is skipped, false otherwise
         */
        function isDisabled() {
            return vm.requisition.$isAuthorized() ||
                vm.requisition.$isApproved() ||
                vm.requisition.$isInApproval() ||
                vm.requisition.$isReleased() ||
                vm.lineItem.skipped;
        }
    }

})();
