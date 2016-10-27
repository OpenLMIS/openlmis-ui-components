(function() {

  'use strict';

  angular
    .module('openlmis.requisitions')
    .constant('Column', column());

  function column() {
    return {
      APPROVED_QUANTITY: 'approvedQuantity',
      BEGINNING_BALANCE: 'beginningBalance',
      REMARKS: 'remarks',
      REQUESTED_QUANTITY: 'requestedQuantity',
      REQUESTED_QUANTITY_EXPLANATION: 'requestedQuantityExplanation',
      STOCK_ON_HAND: 'stockOnHand',
      SKIPPED: 'skipped',
      TOTAL_RECEIVED_QUANTITY: 'totalReceivedQuantity',
      TOTAL_CONSUMED_QUANTITY: 'totalConsumedQuantity',
      TOTAL_LOSSES_AND_ADJUSTMENTS: 'totalLossesAndAdjustments',
      PRODUCT_CODE: 'productCode',
      PRODUCT_NAME: 'productName'
    };
  }

})();