(function() {

  'use strict';

  angular
    .module('openlmis.requisitions')
    .factory('CalculationFactory', calculationFactory);

  calculationFactory.$inject = ['Column'];

  function calculationFactory(Column) {
    var A = Column.BEGINNING_BALANCE,
        B = Column.TOTAL_RECEIVED_QUANTITY,
        C = Column.TOTAL_CONSUMED_QUANTITY,
        D = Column.TOTAL_LOSSES_AND_ADJUSTMENTS,
        E = Column.STOCK_ON_HAND;

    var factory = {
      totalConsumedQuantity: calculateTotalConsumedQuantity,
      stockOnHand: calculateStockOnHand
    };
    return factory;

    function calculateTotalConsumedQuantity(lineItem) {
      return lineItem[A] + lineItem[B] + lineItem[D] - lineItem[E];
    }
    
    function calculateStockOnHand(lineItem) {
      return lineItem[A] + lineItem[B] - lineItem[C] + lineItem[D];
    }
  }

})();