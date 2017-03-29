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
     * @name admin-template.templateValidator
     *
     * @description
     * Provides methods for validating templates and columns.
     */
    angular
        .module('admin-template')
        .factory('templateValidator', factory);

    factory.$inject = [
        'ALPHA_NUMERIC_REGEX', 'MAX_COLUMN_DESCRIPTION_LENGTH', 'TEMPLATE_COLUMNS', 'COLUMN_SOURCES',
        'messageService'
    ];

    function factory(ALPHA_NUMERIC_REGEX, MAX_COLUMN_DESCRIPTION_LENGTH, TEMPLATE_COLUMNS,
                     COLUMN_SOURCES, messageService) {

        var columnValidations = {
                averageConsumption: validateAverageConsumption,
                requestedQuantity: validateRequestedQuantity,
                requestedQuantityExplanation: validateRequestedQuantityExplanation,
                totalStockoutDays: validateTotalStockoutDays
            },
            validator = {
                getColumnError: getColumnError,
                isTemplateValid: isTemplateValid
            };

        return validator;

        /**
         * @ngdoc method
         * @methodOf admin-template.templateValidator
         * @name isTemplateValid
         *
         * @description
         * Checks if the given template is valid.
         *
         * @param   {Object}    template    the template to be checked
         * @return  {Boolean}               true if the template is valid, false otherwise
         */
        function isTemplateValid(template) {
            var isValid = true,
                validator = this;

            angular.forEach(template.columnsMap, function(column) {
                isValid = isValid && !validator.getColumnError(column, template);
            });

            return isValid;
        }

        /**
         * @ngdoc method
         * @methodOf admin-template.templateValidator
         * @name getColumnError
         *
         * @description
         * Validates the given column for errors. If there are any, the first one will be returned.
         *
         * @param   {Object}    column      the column to be validated
         * @param   {Object}    template    the template the column comes from
         * @return  {String}                undefined if column is valid, error as string otherwise
         */
        function getColumnError(column, template) {
            var error = validateLabel(column.label) ||
                validateDefinition(column.definition) ||
                validateSource(column.source) ||
                validateOption(column) ||
                validateCalculated(column, template) ||
                validateUserInput(column, template) ||
                validateColumn(column, template);

            return error;
        }

        function validateLabel(label) {
            if (isEmpty(label)) return messageService.get('error.columnLabelEmpty');
            if (label.length < 2) return messageService.get('error.columnLabelToShort');
            if (!ALPHA_NUMERIC_REGEX.test(label)) return messageService.get('error.columnLabelNotAllowedCharacters');
        }

        function validateDefinition(definition) {
            if (definition && definition.length > MAX_COLUMN_DESCRIPTION_LENGTH) {
                return messageService.get('error.columnDescriptionTooLong');
            }
        }

        function validateSource(source) {
            if (isEmpty(source)) return messageService.get('msg.template.column.sourceEmpty');
        }

        function validateOption(column) {
            if (column.isDisplayed && column.columnDefinition.options.length && !column.option) {
                return messageService.get('msg.template.column.optionEmpty');
            }
        }

        function validateColumn(column, template) {
            var customValidation = columnValidations[column.name];
            if (customValidation) {
                return customValidation(column, template);
            }
        }

        function validateAverageConsumption(column, template) {
            var periodsToAverage = template.numberOfPeriodsToAverage;

            if (isEmpty(periodsToAverage)) return messageService.get('msg.template.emptyNumberOfPeriods');
            if (periodsToAverage < 2) return messageService.get('msg.template.invalidNumberOfPeriods');
        }

        function validateRequestedQuantity(column, template) {
            var wColumn = template.columnsMap[TEMPLATE_COLUMNS.REQUESTED_QUANTITY_EXPLANATION];

            if (column.isDisplayed && !wColumn.isDisplayed) {
                return messageService.get('error.columnDisplayMismatch') + wColumn.label;
            }
        }

        function validateRequestedQuantityExplanation(column, template) {
            var jColumn = template.columnsMap[TEMPLATE_COLUMNS.REQUESTED_QUANTITY];

            if (column.isDisplayed && !jColumn.isDisplayed) {
                return messageService.get('error.columnDisplayMismatch') + jColumn.label;
            }
        }

        function validateCalculated(column, template) {
            var dependencies = '',
                message;

            if(column.source === COLUMN_SOURCES.CALCULATED) {
                var circularDependencyArray = template.$findCircularCalculatedDependencies(column.name);
                angular.forEach(circularDependencyArray, function(dependency) {
                    dependencies = dependencies + ' ' + template.columnsMap[dependency].label + ',';
                });
            }

            if(dependencies.length > 0) {
                dependencies = dependencies.substring(0, dependencies.length - 1); // remove last comma
                return messageService.get('msg.template.column.calculatedError') + dependencies;
            }

            return message;
        }

        function validateUserInput(column) {
            if (!column.isDisplayed && column.source === COLUMN_SOURCES.USER_INPUT && column.columnDefinition.sources.length > 1) {
                return messageService.get('msg.template.column.shouldBeDisplayed') + messageService.get('msg.template.column.isUserInput');
            }
        }

        function validateTotalStockoutDays(column, template) {
            var nColumn = template.columnsMap.adjustedConsumption;
            if (!column.isDisplayed && nColumn.isDisplayed &&
                nColumn.source === COLUMN_SOURCES.CALCULATED) {

                return messageService.get('error.shouldBeDisplayedIfOtherIsCalculated', {
                    column: nColumn.label
                });
            }
        }

        function isEmpty(value) {
            return !value || !value.toString().trim();
        }

    }

})();
