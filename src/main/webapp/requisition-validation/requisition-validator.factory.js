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

    requisitionValidator.$inject = ['validations', 'calculations', 'Columns', 'Source'];

    function requisitionValidator(validations, calculations, Columns, Source) {

        var validationsToPass = {
            stockOnHand: [
                validations.nonNegative,
            ],
            totalConsumedQuantity: [
                validations.nonNegative
            ],
            requestedQuantityExplanation: [
                validations.nonEmptyIfPropertyIsSet(Columns.REQUESTED_QUANTITY)
            ]
        };

        var counterpart = {
            stockOnHand: Columns.TOTAL_CONSUMED_QUANTITY,
            totalConsumedQuantity: Columns.STOCK_ON_HAND
        };

        var validator = {
            validateRequisition: validateRequisition,
            validateLineItem: validateLineItem,
            validateLineItemField: validateLineItemField,
            isLineItemValid: isLineItemValid
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
                fullSupplyColumns = requisition.$template.getColumns(),
                nonFullSupplyColumns = requisition.$template.getColumns(true);

            requisition.$fullSupplyCategories.forEach(function(category) {
              category.lineItems.forEach(function(lineItem) {
                valid = validator.validateLineItem(lineItem, fullSupplyColumns) && valid;
              });
            });

            requisition.$nonFullSupplyCategories.forEach(function(category) {
              category.lineItems.forEach(function(lineItem) {
                valid = validator.validateLineItem(lineItem, nonFullSupplyColumns) && valid;
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
        function validateLineItem(lineItem, columns) {
            var valid = true,
                vlidator = this;

            columns.forEach(function(column) {
                valid = validator.validateLineItemField(lineItem, column, columns) && valid;
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
        function validateLineItemField(lineItem, column, columns) {
            var name = column.name,
                error;

            if (name === Columns.TOTAL_LOSSES_AND_ADJUSTMENTS) return true;

            if (column.required) {
                error = error || validations.nonEmpty(lineItem[name]);
            }

            angular.forEach(validationsToPass[name], function(validation) {
                error = error || validation(lineItem[name], lineItem);
            });

            if (shouldValidateCalculation(lineItem, column, columns)) {
                error = error || validateCalculation(calculations[name], lineItem, name);
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

        function shouldValidateCalculation(lineItem, column, columns) {
            var counterpart = getCounterpart(columns, column.name);
            return calculations[column.name]
                    && !isCalculated(column)
                    && counterpart
                    && !isCalculated(counterpart);
        }

        function validateCalculation(calculation, lineItem, name) {
            return validations.validateCalculation(calculation)(lineItem[name], lineItem);
        }

        function isCalculated(column) {
            return column.source === Source.CALCULATED;
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
