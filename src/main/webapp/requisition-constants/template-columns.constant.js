(function() {

    'use strict';

    angular
        .module('requisition-constants')
        .constant('TEMPLATE_COLUMNS', columns());

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
            PRODUCT_CODE: 'orderable.productCode',
            PRICE_PER_PACK: 'pricePerPack',
            PRODUCT_NAME: 'orderable.name',
            UNIT_UNIT_OF_ISSUE: 'dispensable',
            TOTAL_COST: 'totalCost',
            ADJUSTED_CONSUMPTION: 'adjustedConsumption',
            NUMBER_OF_NEW_PATIENTS_ADDED: 'numberOfNewPatientsAdded',
            TOTAL_STOCKOUT_DAYS: 'totalStockoutDays',
            AVERAGE_CONSUMPTION: 'averageConsumption',
            MAXIMUM_STOCK_QUANTITY: 'maximumStockQuantity',
            CALCULATED_ORDER_QUANTITY: 'calculatedOrderQuantity'
        };
    }

})();
