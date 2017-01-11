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

    lineItem.$inject = ['validations', 'calculationFactory', 'COLUMN_SOURCES', 'Type'];

    function lineItem(validations, calculationFactory, COLUMN_SOURCES, Type) {

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

            this.orderableProduct = lineItem.orderableProduct;
            this.stockAdjustments = lineItem.stockAdjustments;

            this.$errors = {};
            this.$program = this.orderableProduct.$program ? this.orderableProduct.$program : getProgramById(lineItem.orderableProduct.programs, requisition.program.id);

            var newLineItem = this;
            requisition.$template.columns.forEach(function(column) {
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
                    object[propertyName] = calculationFactory[fullName](this, requisition);
                } else if (column.type === Type.NUMERIC) {
                    object[propertyName] = object[propertyName] ? object[propertyName] : 0;
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
            columns = requisition.$template.getColumns(!this.$program.fullSupply);
            columns.forEach(function (column) {
                if (isInputDisplayedAndNotEmpty(column, lineItem)) {
                    result = false;
                }
            });
            return result;
        }

        function isInputDisplayedAndNotEmpty(column, lineItem) {
            return column.display
                && column.source === COLUMN_SOURCES.USER_INPUT
                && column.type !== Type.BOOLEAN
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
    };

})();
