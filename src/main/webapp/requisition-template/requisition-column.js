(function() {

    'use strict';

    angular
    .module('requisition-template')
    .factory('RequisitionColumn', requisitionColumn);

    requisitionColumn.$inject = ['TEMPLATE_COLUMNS', 'COLUMN_SOURCES', 'REQUISITION_STATUS'];

    function requisitionColumn(TEMPLATE_COLUMNS, COLUMN_SOURCES, REQUISITION_STATUS) {

        var nonMandatoryFields = [
            TEMPLATE_COLUMNS.SKIPPED,
            TEMPLATE_COLUMNS.REMARKS,
            TEMPLATE_COLUMNS.TOTAL_LOSSES_AND_ADJUSTMENTS,
            TEMPLATE_COLUMNS.REQUESTED_QUANTITY_EXPLANATION,
            TEMPLATE_COLUMNS.ADJUSTED_CONSUMPTION,
            TEMPLATE_COLUMNS.NUMBER_OF_NEW_PATIENTS_ADDED
        ];

        var dependencies = {
            stockOnHand: [
                TEMPLATE_COLUMNS.BEGINNING_BALANCE,
                TEMPLATE_COLUMNS.TOTAL_RECEIVED_QUANTITY,
                TEMPLATE_COLUMNS.TOTAL_CONSUMED_QUANTITY,
                TEMPLATE_COLUMNS.TOTAL_LOSSES_AND_ADJUSTMENTS

            ],
            totalConsumedQuantity: [
                TEMPLATE_COLUMNS.BEGINNING_BALANCE,
                TEMPLATE_COLUMNS.TOTAL_RECEIVED_QUANTITY,
                TEMPLATE_COLUMNS.STOCK_ON_HAND,
                TEMPLATE_COLUMNS.TOTAL_LOSSES_AND_ADJUSTMENTS
            ],
            total: [
                TEMPLATE_COLUMNS.BEGINNING_BALANCE,
                TEMPLATE_COLUMNS.TOTAL_RECEIVED_QUANTITY
            ],

            packsToShip: [
                TEMPLATE_COLUMNS.REQUESTED_QUANTITY,
                TEMPLATE_COLUMNS.APPROVED_QUANTITY
            ],
            totalCost: [
                TEMPLATE_COLUMNS.PACKS_TO_SHIP,
                TEMPLATE_COLUMNS.PRICE_PER_PACK
            ]
        };

        var nonFullSupplyColumns = [
            TEMPLATE_COLUMNS.REQUESTED_QUANTITY,
            TEMPLATE_COLUMNS.REQUESTED_QUANTITY_EXPLANATION,
            TEMPLATE_COLUMNS.PRODUCT_CODE,
            TEMPLATE_COLUMNS.PRODUCT_NAME,
            TEMPLATE_COLUMNS.UNIT_UNIT_OF_ISSUE,
            TEMPLATE_COLUMNS.PACKS_TO_SHIP,
            TEMPLATE_COLUMNS.APPROVED_QUANTITY,
            TEMPLATE_COLUMNS.REMARKS
        ];

        RequisitionColumn.columnDependencies = columnDependencies;

        return RequisitionColumn;

        function RequisitionColumn(column, requisition) {
            var name = column.name,
            source = column.source;

            this.name = name;
            this.type = column.columnDefinition.columnType;
            this.source = source;
            this.label = column.label;
            this.display = displayColumn(column, requisition);
            this.displayOrder = column.displayOrder;
            this.required = (nonMandatoryFields.indexOf(name) === -1
                && source == COLUMN_SOURCES.USER_INPUT);
            this.fullSupplyOnly = nonFullSupplyColumns.indexOf(name) === -1;
            this.dependencies = dependencies[name];
        }

        function displayColumn(column, requisition) {
            return column.isDisplayed && (
                [TEMPLATE_COLUMNS.APPROVED_QUANTITY, TEMPLATE_COLUMNS.REMARKS].indexOf(column.name) === -1 ||
                [REQUISITION_STATUS.AUTHORIZED, REQUISITION_STATUS.APPROVED].indexOf(requisition.status) > -1);
            }

        function columnDependencies(column) {
            return dependencies[column.name];
        }
    }
})();
