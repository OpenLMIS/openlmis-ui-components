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
     * @name requisition.LineItem
     *
     * @description
     * Responsible for adding required methods for line items.
     */
    angular
    .module('requisition')
    .factory('LineItem', lineItem);

    lineItem.$inject = ['validationFactory', 'calculationFactory', 'COLUMN_SOURCES', 'COLUMN_TYPES'];

    function lineItem(validationFactory, calculationFactory, COLUMN_SOURCES, COLUMN_TYPES) {

        LineItem.prototype.getFieldValue = getFieldValue;
        LineItem.prototype.updateFieldValue = updateFieldValue;
        LineItem.prototype.canBeSkipped = canBeSkipped;

        return LineItem;

        /**
         * @ngdoc function
         * @name LineItem
         * @methodOf requisition.LineItem
         *
         * @description
         * Adds needed properties and methods to line items based on it and requisition parent.
         *
         * @param {Object} lineItem Requisition line item to be updated
         * @param {Object} requisition Requisition that has given line item
         */
        function LineItem(lineItem, requisition) {
            angular.copy(lineItem, this);

            this.orderable = lineItem.orderable;
            this.stockAdjustments = lineItem.stockAdjustments;

            this.$errors = {};
            this.$program = this.orderable.$program ? this.orderable.$program : getProgramById(lineItem.orderable.programs, requisition.program.id);

            var newLineItem = this;
            requisition.template.getColumns(!this.$program.fullSupply).forEach(function(column) {
                newLineItem.updateFieldValue(column, requisition);
            });
        }

        function getFieldValue(name) {
            var value = this;
            angular.forEach(name.split('.'), function(property) {
                value = value[property];
            });
            return value;
        }

        /**
         * @ngdoc function
         * @name updateFieldValue
         * @methodOf requisition.LineItem
         *
         * @description
         * Updates column value in the line item based on column type and source.
         *
         * @param {Object} column Requisition template column
         * @param {Object} requisition Requisition to which line item belongs
         */
        function updateFieldValue(column, requisition) {
            var fullName = column.name,
                object = getObject(this, fullName),
                propertyName = getPropertyName(column.name);

            if(object) {
                if (column.source === COLUMN_SOURCES.CALCULATED) {
                    object[propertyName] = calculationFactory[fullName] ? calculationFactory[fullName](this, requisition) : null;
                } else if (column.$type === COLUMN_TYPES.NUMERIC || column.$type === COLUMN_TYPES.CURRENCY) {
                    checkIfNullOrZero(object[propertyName]);
                } else {
                    object[propertyName] = object[propertyName] ? object[propertyName] : '';
                }
            }
        }

        /**
         * @ngdoc function
         * @name canBeSkipped
         * @methodOf requisition.LineItem
         *
         * @description
         * Determines whether the line item from given requisition can be marked as skipped.
         *
         * @param {Object} requisition Requisition to which line item belongs
         * @return {Boolean} true if line item can be skipped
         */
        function canBeSkipped(requisition) {
            var result = true,
            lineItem = this,
            columns = requisition.template.getColumns(!this.$program.fullSupply);

            if (requisition.$isApproved() || requisition.$isAuthorized() || requisition.$isInApproval()) {
                return false;
            }

            columns.forEach(function (column) {
                if (isInputDisplayedAndNotEmpty(column, lineItem)) {
                    result = false;
                }
            });
            return result;
        }

        function isInputDisplayedAndNotEmpty(column, lineItem) {
            return column.$display
                && column.source === COLUMN_SOURCES.USER_INPUT
                && column.$type !== COLUMN_TYPES.BOOLEAN
                && !isEmpty(lineItem[column.name]);
        }

        function isEmpty(value) {
            return !value || !value.toString().trim();
        }

        function getProgramById(programs, programId) {
            var match;
            programs.forEach(function(program) {
                if (program.programId === programId) {
                    match = program;
                }
            });
            return match;
        }

        function getObject(from, path) {
            var object = from;
            if (path.indexOf('.') > -1) {
                var properties = path.split('.');
                properties.pop();
                properties.forEach(function(property) {
                    object = object[property];
                });
            }
            return object;
        }

        function getPropertyName(fullPath) {
            var id = fullPath.lastIndexOf('.')
            return id > -1 ? fullPath.substr(id) : fullPath;
        }

        function checkIfNullOrZero(value) {
            if (value === 0) {
                value = 0;
            } else if (value === null) {
                value = null;
            }
        }
    };

})();
