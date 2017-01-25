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
        'messageService'
    ];

    function requisitionValidator(validationFactory, calculationFactory, TEMPLATE_COLUMNS,
                                  COLUMN_SOURCES, messageService) {

        var counterpart = {
            stockOnHand: TEMPLATE_COLUMNS.TOTAL_CONSUMED_QUANTITY,
            totalConsumedQuantity: TEMPLATE_COLUMNS.STOCK_ON_HAND
        };

        var validator = {
            validateRequisition: validateRequisition,
            validateLineItem: validateLineItem,
            validateLineItemField: validateLineItemField,
            isLineItemValid: isLineItemValid,
            areLinItemsValid: areLinItemsValid
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

            requisition.$fullSupplyCategories.forEach(function(category) {
              category.lineItems.forEach(function(lineItem) {
                valid = validator.validateLineItem(lineItem, fullSupplyColumns, requisition) && valid;
              });
            });

            requisition.$nonFullSupplyCategories.forEach(function(category) {
              category.lineItems.forEach(function(lineItem) {
                valid = validator.validateLineItem(lineItem, nonFullSupplyColumns, requisition) && valid;
              });
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

            if (column.required) {
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
         * @param  {Object}  lineItem the line item ot be checked
         * @return {Boolean}          true if any of the fields has error, false otherwise
         */
        function isLineItemValid(lineItem) {
            var valid = true;
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
        function areLinItemsValid(lineItems) {
            var valid = true;
            lineItems.forEach(function(lineItem) {
                valid = valid && isLineItemValid(lineItem);
            });
            return valid;
        }

        function shouldValidateCalculation(lineItem, column, columns) {
            var counterpart = getCounterpart(columns, column.name);
            return calculationFactory[column.name]
                    && !isCalculated(column)
                    && counterpart
                    && !isCalculated(counterpart);
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

        function getCounterpart(columns, name) {
            var match;
            columns.forEach(function(column) {
                if (column.name === counterpart[name]) {
                    match = column;
                }
            });
            return match;
        }
    }

})();
