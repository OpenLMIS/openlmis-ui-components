(function() {

  'use strict';

  angular
    .module('openlmis.requisitions')
    .factory('CalculationFactory', calculationFactory);

  function calculationFactory() {
    var A = 'beginningBalance',
        B = 'totalReceivedQuantity',
        C = 'totalConsumedQuantity',
        D = 'totalLossesAndAdjustments',
        E = 'stockOnHand';

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