/*
 * This program is part of the OpenLMIS logistics management information system platform software.
 * Copyright © 2017 VillageReach
 *
 * This program is free software: you can redistribute it and/or modify it under the terms
 * of the GNU Affero General Public License as published by the Free Software Foundation, either
 * version 3 of the License, or (at your option) any later version.
 *  
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY;
 * without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. 
 * See the GNU Affero General Public License for more details. You should have received a copy of
 * the GNU Affero General Public License along with this program. If not, see
 * http://www.gnu.org/licenses.  For additional information contact info@OpenLMIS.org. 
 */

(function() {

    'use strict';

    /**
     * @ngdoc service
     * @name requisition-template.RequisitionColumn
     *
     * @description
     * Provides requisition column object with additional methods and info.
     */
    angular
        .module('requisition-template')
        .factory('RequisitionColumn', requisitionColumn);

    requisitionColumn.$inject = ['TEMPLATE_COLUMNS', 'COLUMN_SOURCES', 'REQUISITION_STATUS'];

    function requisitionColumn(TEMPLATE_COLUMNS, COLUMN_SOURCES, REQUISITION_STATUS) {

        /**
         * @ngdoc property
         * @propertyOf requisition-template.RequisitionColumn
         * @name nonMandatoryFields
         * @type {Array}
         *
         * @description
         * Contains all non-mandatory fields.
         */
        var nonMandatoryFields = [
            TEMPLATE_COLUMNS.SKIPPED,
            TEMPLATE_COLUMNS.REMARKS,
            TEMPLATE_COLUMNS.TOTAL_LOSSES_AND_ADJUSTMENTS,
            TEMPLATE_COLUMNS.REQUESTED_QUANTITY_EXPLANATION,
            TEMPLATE_COLUMNS.ADJUSTED_CONSUMPTION,
            TEMPLATE_COLUMNS.NUMBER_OF_NEW_PATIENTS_ADDED
        ];

        /**
         * @ngdoc property
         * @propertyOf requisition-template.RequisitionColumn
         * @name dependencies
         * @type {Array}
         *
         * @description
         * Contains all columns dependencies.
         */
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
            ],
            adjustedConsumption: [
                TEMPLATE_COLUMNS.TOTAL_CONSUMED_QUANTITY,
                TEMPLATE_COLUMNS.TOTAL_STOCKOUT_DAYS
            ],
            averageConsumption: [
                TEMPLATE_COLUMNS.ADJUSTED_CONSUMPTION
            ],
            requestedQuantityExplanation: [
                TEMPLATE_COLUMNS.REQUESTED_QUANTITY
            ],
            maximumStockQuantity: [
                TEMPLATE_COLUMNS.AVERAGE_CONSUMPTION
            ],
            calculatedOrderQuantity: [
                TEMPLATE_COLUMNS.MAXIMUM_STOCK_QUANTITY,
                TEMPLATE_COLUMNS.STOCK_ON_HAND
            ]
        };

        /**
         * @ngdoc property
         * @propertyOf requisition-template.RequisitionColumn
         * @name nonFullSupplyColumns
         * @type {Array}
         *
         * @description
         * Contains all columns that are visible for non-full supply.
         */
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

        /**
         * @ngdoc method
         * @methodOf requisition-template.RequisitionColumn
         * @name RequisitionColumn
         *
         * @description
         * Adds additional info to requisition column.
         *
         * @param  {Object}            column      requisition column object form server
         * @param  {Object}            requisition requisition object from server
         * @return {RequisitionColumn}             column with additional info
         */
        function RequisitionColumn(column, requisition) {
            angular.copy(column, this);

            this.$type = column.columnDefinition.columnType;
            this.$display = displayColumn(column, requisition);
            this.$required = (nonMandatoryFields.indexOf(this.name) === -1 &&
                this.source == COLUMN_SOURCES.USER_INPUT);
            this.$fullSupplyOnly = nonFullSupplyColumns.indexOf(this.name) === -1;
            this.$dependencies = dependencies[this.name];
            this.$canChangeOrder = column.columnDefinition.canChangeOrder;
        }

        /**
         * @ngdoc method
         * @methodOf requisition-template.RequisitionColumn
         * @name displayColumn
         *
         * @description
         * Adds additional info to requisition column.
         *
         * @param  {Object}            column      requisition column object form server
         * @param  {Object}            requisition requisition object from server
         * @return {RequisitionColumn}             column with additional info
         */
        function displayColumn(column, requisition) {
            return column.isDisplayed && (
                [TEMPLATE_COLUMNS.APPROVED_QUANTITY, TEMPLATE_COLUMNS.REMARKS].indexOf(column.name) === -1 ||
                requisition.$isAfterAuthorize());
            }

        function columnDependencies(column) {
            return dependencies[column.name];
        }
    }
})();
