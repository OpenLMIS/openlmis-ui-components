(function() {

    'use strict';

    /**
     * @ngdoc service
     * @name requisition-validation.validationFactory
     *
     * @description
     * Provides validation of columns that require some custom checks.
     */
    angular
        .module('requisition-validation')
        .factory('validationFactory', validationFactory);

    validationFactory.$inject = ['messageService', 'TEMPLATE_COLUMNS', 'calculationFactory'];

    function validationFactory(messageService, TEMPLATE_COLUMNS, calculationFactory) {
        var factory = {
            stockOnHand: validateStockOnHand,
            totalConsumedQuantity: validateTotalConsumedQuantity,
            requestedQuantityExplanation: validateRequestedQuantityExplanation
        };
        return factory;

        /**
         * @ngdoc method
         * @methodOf requisition-validation.validationFactory
         * @name stockOnHand
         *
         * @description
         * Provides custom validator for the stock on hand column.
         *
         * @param   {Object}    lineItem    the line item to be validated
         * @return  {String}                the error if field is invalid, undefined otherwise
         */
        function validateStockOnHand(lineItem) {
            if (lineItem.stockOnHand < 0) {
                return messageService.get('error.negative');
            }
        }

        /**
         * @ngdoc method
         * @methodOf requisition-validation.validationFactory
         * @name totalConsumedQuantity
         *
         * @description
         * Provides custom validator for the total consumed quantity column.
         *
         * @param   {Object}    lineItem    the line item to be validated
         * @return  {String}                the error if field is invalid, undefined otherwise
         */
        function validateTotalConsumedQuantity(lineItem) {
            if (lineItem.totalConsumedQuantity < 0) {
                return messageService.get('error.negative');
            }
        }

        /**
         * @ngdoc method
         * @methodOf requisition-validation.validationFactory
         * @name requestedQuantityExplanation
         *
         * @description
         * Provides custom validator for the requested quantity explanation column.
         *
         * @param   {Object}    lineItem    the line item to be validated
         * @param   {Object}    requisition the requisition to validate the field for
         * @return  {String}                the error if field is invalid, undefined otherwise
         */
        function validateRequestedQuantityExplanation(lineItem, requisition) {
            var jColumn = requisition.template.getColumn(TEMPLATE_COLUMNS.REQUESTED_QUANTITY),
                iColumn = requisition.template.getColumn(TEMPLATE_COLUMNS.CALCULATED_ORDER_QUANTITY),
                explanation = lineItem.requestedQuantityExplanation,
                requested = lineItem.requestedQuantity;

            if (isDisplayed(jColumn)) {
                if (requested === null || requested === undefined) return;

                if (isDisplayed(iColumn)) {
                    if (quantitiesDiffer(lineItem, requisition) && !explanation) {
                        return messageService.get('error.required');
                    }
                } else if (requested && !explanation) {
                    return messageService.get('error.required');
                }
            }
        }

        function quantitiesDiffer(lineItem, requisition) {
            var calculated = calculationFactory.calculatedOrderQuantity(lineItem, requisition),
                entered = lineItem.requestedQuantity;
            return calculated !== entered;
        }

        function isDisplayed(column) {
            return column && column.display;
        }
    }

})();
