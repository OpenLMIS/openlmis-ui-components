(function() {

  'use strict';

  /**
   * @ngdoc service
   * @name requisition-calculations.calculations
   *
   * @description
   * Responsible for storing all the calculations related with the line item and product grid.
   */
  angular
    .module('requisition-calculations')
    .factory('calculations', calculations);

  calculations.$inject = ['Columns', '$filter', 'Status'];

  function calculations(Columns, $filter, Status) {
    var A = Columns.BEGINNING_BALANCE,
        B = Columns.TOTAL_RECEIVED_QUANTITY,
        C = Columns.TOTAL_CONSUMED_QUANTITY,
        D = Columns.TOTAL_LOSSES_AND_ADJUSTMENTS,
        E = Columns.STOCK_ON_HAND,
        Y = Columns.TOTAL,
        K = Columns.APPROVED_QUANTITY,
        J = Columns.REQUESTED_QUANTITY,
        V = Columns.PACKS_TO_SHIP,
        Q = Columns.TOTAL_COST,
        T = Columns.PRICE_PER_PACK,
        N = Columns.ADJUSTED_CONSUMPTION;

    var calculations = {
      totalConsumedQuantity: calculateTotalConsumedQuantity,
      stockOnHand: calculateStockOnHand,
      totalLossesAndAdjustments: calculateTotalLossesAndAdjustments,
      total: calculateTotal,
      packsToShip: calculatePacksToShip,
      totalCost: calculateTotalCost,
      adjustedConsumption: calculateAdjustedConsumption
    };
    return calculations;

    /**
     * @ngdoc function
     * @name totalConsumedQuantity
     * @methodOf requisition-calculations.calculations
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
     * @methodOf requisition-calculations.calculations
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
     * @methodOf requisition-calculations.calculations
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
     * @methodOf requisition-calculations.calculations
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
     * @methodOf requisition-calculations.calculations
     *
     * @description
     * Calculates the value of the Packs to Ship column based on the given line item and requisition status.
     *
     * @param  {Object} lineItem the line item to calculate the value from
     * @param  {String} status   the status of the requisition
     * @return {Number}          the calculated Packs to Ship value
     */
    function calculatePacksToShip(lineItem, status) {
        var orderQuantity = getOrderQuantity(lineItem, status),
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
     * @methodOf requisition-calculations.calculations
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
       * @methodOf requisition-calculations.calculations
       *
       * @description
       * Calculates the value of the Adjusted Consumption column based on the given line item.
       *
       * @param  {Object} lineItem  the line item to calculate the value from
       * @param  {Object} period    period that is used to calculations
       * @return {Number}           the calculated Adjusted Consumption value
       */
      function calculateAdjustedConsumption(lineItem, period) {
        var consumedQuantity = lineItem[C];
        if (consumedQuantity === undefined) {
            return 0;
        }

        var totalDays = 30 * getNumberOfMonthsInPeriod(period);
        var stockoutDays = lineItem.totalStockoutDays === undefined ? 0: lineItem.totalStockoutDays;
        var nonStockoutDays = totalDays - stockoutDays;
        if (nonStockoutDays === 0) {
            return consumedQuantity;
        }

        var adjustedConsumption = consumedQuantity * Math.ceil((totalDays / nonStockoutDays));
        return adjustedConsumption;
      }

    /**
     * @ngdoc function
     * @name getOrderQuantity
     * @methodOf requisition-calculations.calculations
     * @private
     *
     * @describtion
     * Returns the value of the order quantity based on the requisitions status.
     *
     * @param  {Object} lineItem the line item to get the order quantity from
     * @param  {String} status   the status of the requisitions
     * @return {Number}          the value of the order quantity
     */
    function getOrderQuantity(lineItem, status) {
        return status === Status.AUTHORIZED ? lineItem[K] : lineItem[J];
    }
  }

    function getNumberOfMonthsInPeriod(period) {
        var startMonth = period.startDate[1];
        var endMonth = period.endDate[1];
        var startYear = period.startDate[0];
        var endYear = period.endDate[0];

        return endMonth - startMonth + (12 * (endYear - startYear)) + 1;
    }

})();
