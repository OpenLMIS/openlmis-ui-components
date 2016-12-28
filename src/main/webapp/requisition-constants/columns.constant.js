(function() {

    'use strict';

    angular
        .module('requisition-constants')
        .constant('Columns', columns());

    function columns() {
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
            TOTAL: 'total',
            PACKS_TO_SHIP: 'packsToShip',
            PRODUCT_CODE: 'orderableProduct.productCode',
            PRICE_PER_PACK: 'pricePerPack',
            PRODUCT_NAME: 'orderableProduct.name',
            UNIT_UNIT_OF_ISSUE: 'dispensable',
            TOTAL_COST: 'totalCost',
            ADJUSTED_CONSUMPTION: 'adjustedConsumption'
        };
    }

})();
