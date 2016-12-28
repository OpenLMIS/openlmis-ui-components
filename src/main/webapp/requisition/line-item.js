(function() {

    'use strict';

    /**
     * @ngdoc service
     * @name openlmis.requisitions.LineItem
     *
     * @description
     * Responsible for adding required methods for line items.
     */
    angular
    .module('requisition')
    .factory('LineItem', lineItem);

    lineItem.$inject = ['validations', 'calculations', 'Columns', 'Source', 'Type'];

    function lineItem(validations, calculations, Columns, Source, Type) {

        LineItem.prototype.getFieldValue = getFieldValue;
        LineItem.prototype.updateFieldValue = updateFieldValue;

        return LineItem;

        /**
         * @ngdoc function
         * @name LineItem
         * @methodOf openlmis.requisitions.LineItem
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
         * @methodOf openlmis.requisitions.LineItem
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
                if (column.source === Source.CALCULATED) {
                    if (fullName === 'adjustedConsumption') {
                        object[propertyName] = calculations[fullName](this, requisition.processingPeriod);
                    } else {
                        object[propertyName] = calculations[fullName](this, requisition.status);
                    }
                } else if (column.type === Type.NUMERIC) {
                    object[propertyName] = object[propertyName] ? object[propertyName] : 0;
                } else {
                    object[propertyName] = object[propertyName] ? object[propertyName] : '';
                }
            }
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
