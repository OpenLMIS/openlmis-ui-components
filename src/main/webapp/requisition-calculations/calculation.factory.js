(function() {

    'use strict';

    /**
     * @ngdoc service
     * @name requisition-calculations.calculationFactory
     *
     * @description
     * Responsible for storing all the calculations related with the line item and product grid.
     */
    angular
    .module('requisition-calculations')
    .factory('calculationFactory', factory);

    factory.$inject = ['TEMPLATE_COLUMNS', '$filter'];

    function factory(TEMPLATE_COLUMNS, $filter) {
        var A = TEMPLATE_COLUMNS.BEGINNING_BALANCE,
        B = TEMPLATE_COLUMNS.TOTAL_RECEIVED_QUANTITY,
        C = TEMPLATE_COLUMNS.TOTAL_CONSUMED_QUANTITY,
        D = TEMPLATE_COLUMNS.TOTAL_LOSSES_AND_ADJUSTMENTS,
        E = TEMPLATE_COLUMNS.STOCK_ON_HAND,
        Y = TEMPLATE_COLUMNS.TOTAL,
        K = TEMPLATE_COLUMNS.APPROVED_QUANTITY,
        J = TEMPLATE_COLUMNS.REQUESTED_QUANTITY,
        V = TEMPLATE_COLUMNS.PACKS_TO_SHIP,
        Q = TEMPLATE_COLUMNS.TOTAL_COST,
        T = TEMPLATE_COLUMNS.PRICE_PER_PACK,
        N = TEMPLATE_COLUMNS.ADJUSTED_CONSUMPTION;

        var calculationFactory = {
            totalConsumedQuantity: calculateTotalConsumedQuantity,
            stockOnHand: calculateStockOnHand,
            totalLossesAndAdjustments: calculateTotalLossesAndAdjustments,
            total: calculateTotal,
            packsToShip: calculatePacksToShip,
            totalCost: calculateTotalCost,
            adjustedConsumption: calculateAdjustedConsumption
        };
        return calculationFactory;

        /**
         * @ngdoc function
         * @name totalConsumedQuantity
         * @methodOf requisition-calculations.calculationFactory
         *
         * @description
         * Calculates the value of the Total Consumed Quantity column based on the given line item.
         *
         * @param  {Object} lineItem the line item to calculate the value from
         * @return {Number}          the calculated Total Consumed Quantity value
         */
        function calculateTotalConsumedQuantity(lineItem) {
            return lineItem[A] + lineItem[B] + lineItem[D] - lineItem[E];
        }

        /**
         * @ngdoc function
         * @name  stockOnHand
         * @methodOf requisition-calculations.calculationFactory
         *
         * @description
         * Calculates the value of the Stock On Hand column based on the given line item.
         *
         * @param  {Object} lineItem the line item to calculate the value from
         * @return {Number}          the calculated Stock On Hand value
         */
        function calculateStockOnHand(lineItem) {
            return lineItem[A] + lineItem[B] - lineItem[C] + lineItem[D];
        }

        /**
         * @ngdoc function
         * @name  total
         * @methodOf requisition-calculations.calculationFactory
         *
         * @description
         * Calculates the value of the Total column based on the given line item.
         *
         * @param  {Object} lineItem the line item to calculate the value from
         * @return {Number}          the calculated Total value
         */
        function calculateTotal(lineItem) {
            return lineItem[A] + lineItem[B];
        }

        /**
         * @ngdocs function
         * @name  totalLossesAndAdjustments
         * @methodOf requisition-calculations.calculationFactory
         *
         * @description
         * Calculates the value of the Total Losses and Adjustments column based on the given line item and adjustment reasons.
         *
         * @param  {Object} lineItem               the line item to calculate the value from
         * @param  {List}   stockAdjustmentReasons the list of stock adjustment reasons
         * @return {Number}                        the calculated Total Losses and Adjustments value
         */
        function calculateTotalLossesAndAdjustments(lineItem, stockAdjustmentReasons) {
            var total = 0;
            angular.forEach(lineItem.stockAdjustments, function(adjustment) {
                var filteredReasons = $filter('filter')(stockAdjustmentReasons, {id: adjustment.reasonId}, true);
                var reason = (filteredReasons) ? filteredReasons[0] : null;
                if (!!reason) {
                    if (reason.additive === true) {
                        total += adjustment.quantity;
                    } else {
                        total -= adjustment.quantity;
                    }
                }
            });
            return total;
        }

        /**
         * @ngdoc function
         * @name packsToShip
         * @methodOf requisition-calculations.calculationFactory
         *
         * @description
         * Calculates the value of the Packs to Ship column based on the given line item and requisition status.
         *
         * @param  {Object} lineItem    the line item to calculate the value from
         * @param  {String} requisition the requisition
         * @return {Number}             the calculated Packs to Ship value
         */
        function calculatePacksToShip(lineItem, requisition) {
            var orderQuantity = getOrderQuantity(lineItem, requisition),
            packSize = lineItem.orderableProduct.packSize;

            if (orderQuantity === 0 || packSize === 0) {
                return 0;
            } else {
                var remainderQuantity = orderQuantity % packSize,
                packsToShip = (orderQuantity - remainderQuantity) / packSize;

                if (remainderQuantity > 0 && remainderQuantity > lineItem.orderableProduct.packRoundingThreshold) {
                    packsToShip += 1;
                }

                if (packsToShip == 0 && !lineItem.orderableProduct.roundToZero) {
                    packsToShip = 1;
                }

                return packsToShip;
            }
        }

        /**
         * @ngdoc function
         * @name calculateTotalCost
         * @methodOf requisition-calculations.calculationFactory
         * @private
         *
         * @description
         * Calculates the total cost by multiplying price per pack and packs to ship.
         *
         * @param  {Object} lineItem the line item to get the values from
         * @return {Number}          the total cost of this line item
         */
        function calculateTotalCost(lineItem) {
            var pricePerPack = lineItem[T];
            if (pricePerPack === undefined) {
                pricePerPack = 0;
            }
            var packsToShip = lineItem[V];
            if (packsToShip === undefined) {
                packsToShip = 0;
            }
            return pricePerPack * packsToShip;
        }

        /**
         * @ngdoc function
         * @name adjustedConsumption
         * @methodOf requisition-calculations.calculationFactory
         *
         * @description
         * Calculates the value of the Adjusted Consumption column based on the given line item.
         *
         * @param  {Object} lineItem    the line item to calculate the value from
         * @param  {Object} requisition the requisition with required period
         * @return {Number}             the calculated Adjusted Consumption value
         */
        function calculateAdjustedConsumption(lineItem, requisition) {
            var consumedQuantity = lineItem[C];
            if (consumedQuantity === undefined) {
                return 0;
            }

            var totalDays = 30 * requisition.processingPeriod.durationInMonths;
            var stockoutDays = lineItem.totalStockoutDays === undefined ? 0: lineItem.totalStockoutDays;
            var nonStockoutDays = totalDays - stockoutDays;
            if (nonStockoutDays === 0) {
                return consumedQuantity;
            }

            var adjustedConsumption = Math.ceil(consumedQuantity * (totalDays / nonStockoutDays));
            return adjustedConsumption;
        }

        /**
         * @ngdoc function
         * @name getOrderQuantity
         * @methodOf requisition-calculations.calculationFactory
         * @private
         *
         * @description
         * Returns the value of the order quantity based on the requisition status.
         *
         * @param  {Object} lineItem    the line item to get the order quantity from
         * @param  {String} requisition the requisition with required status
         * @return {Number}             the value of the order quantity
         */
        function getOrderQuantity(lineItem, requisition) {
            return requisition && requisition.$isAuthorized() ? lineItem[K] : lineItem[J];
        }
    }
})();
