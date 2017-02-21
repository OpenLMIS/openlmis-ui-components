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
            requestedQuantityExplanation: validateRequestedQuantityExplanation,
            totalStockoutDays: validateTotalStockoutDays
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
                    if (quantitiesDiffer(lineItem, requisition) && requested > 0 && !explanation) {
                        return messageService.get('error.required');
                    }
                } else if (requested > 0 && !explanation) {
                    return messageService.get('error.required');
                }
            }
        }

        /**
         * @ngdoc method
         * @methodOf requisition-validation.validationFactory
         * @name validateTotalStockoutDays
         *
         * @description
         * Provides custom validator for the total stock out days column.
         *
         * @param   {Object}    lineItem    the line item to be validated
         * @param   {Object}    requisition the requisition to validate the field for
         * @return  {String}                the error if field is invalid, undefined otherwise
         */
        function validateTotalStockoutDays(lineItem, requisition) {
            var totalDays = 30 * requisition.processingPeriod.durationInMonths,
                totalStockoutDays = lineItem.totalStockoutDays,
                nonStockoutDays = totalDays - totalStockoutDays;

            if (nonStockoutDays < 0) {
                return messageService.get('error.valueExceedPeriodDuration');
            }
        }

        function quantitiesDiffer(lineItem, requisition) {
            var calculated = calculationFactory.calculatedOrderQuantity(lineItem, requisition),
                entered = lineItem.requestedQuantity;
            return calculated !== entered;
        }

        function isDisplayed(column) {
            return column && column.$display;
        }
    }

})();
