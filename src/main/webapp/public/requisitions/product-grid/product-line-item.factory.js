(function() {
  
  'use strict';

  angular.module('openlmis.requisitions').factory('productGridCellValue', productGridCellValue);

  function productGridCellValue() {

    var A = 'beginningBalance',
        B = 'totalReceivedQuantity',
        C = 'totalConsumedQuantity',
        D = 'totalLossesAndAdjustments',
        E = 'stockOnHand';

    var calculations = {
      totalConsumedQuantity: function(row) {
        return row[A] + row[B] + row[D] - row[E];
      },
      stockOnHand: function(row) {
        return row[A] + row[B] - row[C] + row[D];
      }
    };

    return {
      evaluate: function(row, col) {
        if (col.source === 'CALCULATED') {
          return calculations[col.columnDefinition.name](row);
        }
        return row[col.columnDefinition.name];
      }
    }
  };

})();