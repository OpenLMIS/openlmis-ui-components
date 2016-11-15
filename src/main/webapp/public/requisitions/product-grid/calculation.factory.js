(function() {

  'use strict';

  angular
    .module('openlmis.requisitions')
    .factory('CalculationFactory', calculationFactory);

  calculationFactory.$inject = ['Column', '$filter'];

  function calculationFactory(Column, $filter) {
    var A = Column.BEGINNING_BALANCE,
        B = Column.TOTAL_RECEIVED_QUANTITY,
        C = Column.TOTAL_CONSUMED_QUANTITY,
        D = Column.TOTAL_LOSSES_AND_ADJUSTMENTS,
        E = Column.STOCK_ON_HAND,
        Y = Column.TOTAL,
        K = Column.APPROVED_QUANTITY,
        J = Column.REQUESTED_QUANTITY,
        V = Column.PACKS_TO_SHIP;

    var factory = {
      totalConsumedQuantity: calculateTotalConsumedQuantity,
      stockOnHand: calculateStockOnHand,
      totalLossesAndAdjustments: calculateTotalLossesAndAdjustments,
      total: calculateTotal,
      packsToShip: calculatePacksToShip
    };
    return factory;

    function calculateTotalConsumedQuantity(lineItem) {
      return lineItem[A] + lineItem[B] + lineItem[D] - lineItem[E];
    }
    
    function calculateStockOnHand(lineItem) {
      return lineItem[A] + lineItem[B] - lineItem[C] + lineItem[D];
    }

    function calculateTotal(lineItem) {
      return lineItem[A] + lineItem[B];
    }

    function calculateTotalLossesAndAdjustments(lineItem, stockAdjustmentReasons) {
      var total = 0;
      angular.forEach(lineItem.stockAdjustments, function(adjustment) {
        var reason = $filter('filter')(stockAdjustmentReasons, {id: adjustment.reasonId}, true);
        if (!!reason) {
            if (reason[0].additive === true) {
              total += adjustment.quantity;
            } else {
              total -= adjustment.quantity;
            }
        }
      });
      return total;
    }

    function calculatePacksToShip(lineItem) {
        var orderQuantity = getOrderQuantity(lineItem),
            packSize = lineItem.orderableProduct.packSize;

        if (orderQuantity === 0 || packSize === 0) {
            return 0;
        } else {
            var packsToShip = Math.trunc(orderQuantity / packSize),
                remainderQuantity = orderQuantity % packSize;

            if (remainderQuantity > 0 && remainderQuantity >= lineItem.orderableProduct.packRoundingThreshold) {
              packsToShip += 1;
            }

            if (packsToShip == 0 && !lineItem.orderableProduct.roundToZero) {
              packsToShip = 1;
            }

            return packsToShip;
        }
    }

    function getOrderQuantity(lineItem) {
        if (lineItem[K] !== null && lineItem[K] !== undefined) {
            return lineItem[K];
        }

        if (lineItem[J] !== null && lineItem[J] !== undefined) {
            return lineItem[J];
        }

        return 0;
    }
  }

})();