(function() {
  
  'use strict';

  angular.module('openlmis.requisitions').factory('productLineItem', productLineItem);

  function productLineItem() {

    var A = 'beginningBalance',
        B = 'totalReceivedQuantity',
        C = 'totalConsumedQuantity',
        D = 'totalLossesAndAdjustments',
        E = 'stockOnHand';

    var calculations = {
      totalConsumedQuantity: function(lineItem) {
        return lineItem[A] + lineItem[B] + lineItem[D] - lineItem[E];
      },
      stockOnHand: function(lineItem) {
        return lineItem[A] + lineItem[B] - lineItem[C] + lineItem[D];
      }
    };

    return {
      evaluate: function(lineItem, property, calculated) {
        if (calculated) {
          return calculations[property](lineItem);
        }
        return lineItem[property];
      }
    }
  };

})();