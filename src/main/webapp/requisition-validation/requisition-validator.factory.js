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
     * @name requisition-validation.requisitionValidator
     *
     * @description
     * Responsible for validating requisitions, lineItems and their fields.
     */
    angular
        .module('requisition-validation')
        .factory('requisitionValidator', requisitionValidator);

    requisitionValidator.$inject = [
        'validationFactory', 'calculationFactory', 'TEMPLATE_COLUMNS', 'COLUMN_SOURCES',
        'messageService', '$filter'
    ];

    function requisitionValidator(validationFactory, calculationFactory, TEMPLATE_COLUMNS,
                                  COLUMN_SOURCES, messageService, $filter) {

        var counterparts = {
            stockOnHand: TEMPLATE_COLUMNS.TOTAL_CONSUMED_QUANTITY,
            totalConsumedQuantity: TEMPLATE_COLUMNS.STOCK_ON_HAND
        };

        var validator = {
            validateRequisition: validateRequisition,
            validateLineItem: validateLineItem,
            validateLineItemField: validateLineItemField,
            isLineItemValid: isLineItemValid,
            areLineItemsValid: areLineItemsValid
        };
        return validator;

        /**
         * @ngdoc function
         * @name validateRequisition
         * @methodOf requisition-validation.requisitionValidator
         *
         * @description
         * Validates the given requisitions.
         *
         * @param  {Object} requisition the requisition to be validated
         * @return {Boolean}            true if the requisition is valid, false otherwise
         */
        function validateRequisition(requisition) {
            var valid = true,
                validator = this,
                fullSupplyColumns = requisition.template.getColumns(),
                nonFullSupplyColumns = requisition.template.getColumns(true);

            angular.forEach($filter('filter')(requisition.requisitionLineItems, {
                $program: {
                    fullSupply: true
                }
            }), function(lineItem) {
                valid = validator.validateLineItem(lineItem, fullSupplyColumns, requisition) && valid;
            });

            angular.forEach($filter('filter')(requisition.requisitionLineItems, {
                $program: {
                    fullSupply: false
                }
            }), function(lineItem) {
                valid = validator.validateLineItem(lineItem, nonFullSupplyColumns, requisition) && valid;
            });

            return valid;
        }

        /**
         * @ngdoc method
         * @name validateLineItem
         * @methodOf requisition-validation.requisitionValidator
         *
         * @description
         * Validates the given line item.
         *
         * @param  {Object} lineItem the line item to be validated
         * @param  {Object} columns  the list of columns to validate the line item for
         * @return {Boolean}         true if the line item is valid, false otherwise
         */
        function validateLineItem(lineItem, columns, requisition) {
            var valid = true,
                validator = this;

            columns.forEach(function(column) {
                valid = validator.validateLineItemField(lineItem, column, columns, requisition) && valid;
            });
            return valid;
        }

        /**
         * @ngdoc method
         * @name validateLineItemField
         * @methodOf requisition-validation.requisitionValidator
         *
         * @description
         * Validates the field of the given requisition for the given column. Columns list is
         * necessary for validating calculations.
         *
         * @param  {Object} lineItem the line item to be validated
         * @param  {Object} column   the column to validate the line item for
         * @param  {Object} columns  the list of columns used for validating the line item
         * @return {Boolean}         true of the line item field is valid, false otherwise
         */
        function validateLineItemField(lineItem, column, columns, requisition) {
            var name = column.name,
                error;

            if (lineItem[TEMPLATE_COLUMNS.SKIPPED]) return true;

            if (name === TEMPLATE_COLUMNS.TOTAL_LOSSES_AND_ADJUSTMENTS) return true;

            if (column.$required) {
                error = error || nonEmpty(lineItem[name]);
            }

            if (validationFactory[name]) {
                error = error || validationFactory[name](lineItem, requisition);
            }

            if (shouldValidateCalculation(lineItem, column, columns)) {
                error = error || validateCalculation(calculationFactory[name], lineItem, name);
            }

            return !(lineItem.$errors[name] = error);
        }

        /**
         * @ngdoc method
         * @name isLineItemValid
         * @methodOf requisition-validation.requisitionValidator
         *
         * @description
         * Checks whether any field of the given line item has any error. It does not perform any
         * validation.
         *
         * @param  {Object}  lineItem the line item to be checked
         * @return {Boolean}          true if any of the fields has error, false otherwise
         */
        function isLineItemValid(lineItem) {
            var valid = true,
                isSkipped = lineItem.skipped ? lineItem.skipped : false;
            if(isSkipped) return true;
            angular.forEach(lineItem.$errors, function(error) {
                valid = valid && !error;
            });
            return valid;
        }

        /**
         * @ngdoc method
         * @name areLineItemsValid
         * @methodOf requisition-validation.requisitionValidator
         *
         * @description
         * Checks whether any field of the given line items has any error. It does not perform any
         * validation.
         *
         * @param   {Array} lineItem    the list of line items to be checked
         * @return  {Boolean}           true if any of the line items has error, false otherwise
         */
        function areLineItemsValid(lineItems) {
            var valid = true,
                validator = this;

            lineItems.forEach(function(lineItem) {
                valid = valid && validator.isLineItemValid(lineItem);
            });

            return valid;
        }

        function shouldValidateCalculation(lineItem, column, columns) {
            var counterpart = columns[counterparts[column.name]];
            return calculationFactory[column.name] && !isCalculated(column) && counterpart &&
                !isCalculated(counterpart);
        }

        function nonEmpty(value) {
            if (value === null || value === undefined || value === '') {
                return messageService.get('error.required');
            }
        }

        function validateCalculation(calculation, lineItem, name) {
            if (lineItem[name] !== calculation(lineItem)) {
                return messageService.get('error.wrongCalculation');
            }
        }

        function isCalculated(column) {
            return column.source === COLUMN_SOURCES.CALCULATED;
        }
    }

})();
