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
     * @name requisition-summary.RequisitionSummaryController
     *
     * @description
     * Responsible for managing Requisition Total Cost popover.
     */
    angular
        .module('requisition-summary')
        .controller('RequisitionSummaryController', controller);

    controller.$inject = ['$scope', '$filter', 'calculationFactory'];

    function controller($scope, $filter, calculationFactory) {
        var vm = this;

        vm.calculateFullSupplyCost = calculateFullSupplyCost;
        vm.calculateNonFullSupplyCost = calculateNonFullSupplyCost;
        vm.calculateTotalCost = calculateTotalCost;

        /**
         * @ngdoc property
         * @propertyOf requisition-summary.RequisitionSummaryController
         * @type {Object}
         * @name requisition
         *
         * @description
         * The requisition to render the summary for.
         */
        vm.requisition = $scope.requisition;

        /**
         * @ngdoc property
         * @propertyOf requisition-summary.RequisitionSummaryController
         * @type {Boolean}
         * @name showNonFullSupplySummary
         *
         * @description
         * Flag dictating whether non full supply summary should be visible inside the popover.
         */
        vm.showNonFullSupplySummary = vm.requisition.program.showNonFullSupplyTab;

        /**
         * @ngdoc method
         * @name calculateFullSupplyCost
         * @methodOf requisition-summary.RequisitionSummaryController
         *
         * @description
         * Calculates total cost of all full supply line items. This method will ignore skipped
         * line items.
         *
         * @return {Number} the total cost of all full supply line items
         */
        function calculateFullSupplyCost() {
            return calculateCost(true);
        }

        /**
         * @ngdoc method
         * @name calculateNonFullSupplyCost
         * @methodOf requisition-summary.RequisitionSummaryController
         *
         * @description
         * Calculates total cost of all non full supply line items. This method will ignore skipped
         * line items.
         *
         * @return {Number} the total cost of all non full supply line items
         */
        function calculateNonFullSupplyCost() {
            return calculateCost(false);
        }

        /**
         * @ngdoc method
         * @name calculateTotalCost
         * @methodOf requisition-summary.RequisitionSummaryController
         *
         * @description
         * Calculates total cost of all line items. This method will ignore skipped line items.
         *
         * @return {Number} the total cost of all line items
         */
        function calculateTotalCost() {
            return calculateCost();
        }

        function calculateCost(fullSupply) {
            var sum = 0;

            getLineItems(fullSupply).forEach(function(lineItem) {
                if (!lineItem.skipped) {
                    sum += calculationFactory.totalCost(lineItem, vm.requisition);
                }
            });

            return sum;
        }

        function getLineItems(fullSupply) {
            var lineItems;

            if (fullSupply === undefined) {
                lineItems = vm.requisition.requisitionLineItems;
            } else {
                lineItems = $filter('filter')(vm.requisition.requisitionLineItems, {
                    $program: {
                        fullSupply: fullSupply
                    }
                });
            }

            return lineItems;
        }
    }

})();
