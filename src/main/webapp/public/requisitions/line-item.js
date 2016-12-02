(function() {

    'use strict';

    angular
    .module('openlmis.requisitions')
    .factory('LineItem', lineItem);

    lineItem.$inject = ['validations', 'calculations', 'Columns', 'Source', 'Type'];

    function lineItem(validations, calculations, Columns, Source, Type) {

        LineItem.prototype.getFieldValue = getFieldValue;
        LineItem.prototype.updateFieldValue = updateFieldValue;

        return LineItem;

        function LineItem(lineItem, requisition) {
            angular.copy(lineItem, this);

            this.orderableProduct = lineItem.orderableProduct
            this.stockAdjustments = lineItem.stockAdjustments;

            this.$errors = {};
            this.$program = getProgramById(lineItem.orderableProduct.programs, requisition.program.id);

            var newLineItem = this;
            requisition.$template.columns.forEach(function(column) {
                newLineItem.updateFieldValue(column, requisition.status);
            });
        }

        function getFieldValue(name) {
            var value = this;
            angular.forEach(name.split('.'), function(property) {
                value = value[property];
            });
            return value;
        }

        function updateFieldValue(column, status) {
            var fullName = column.name,
                object = getObject(this, fullName),
                propertyName = getPropertyName(column.name);

            if (column.source === Source.CALCULATED) {
                object[propertyName] = calculations[fullName](this, status);
            } else if (column.type === Type.NUMERIC) {
                object[propertyName] = object[propertyName] ? object[propertyName] : 0;
            } else {
                object[propertyName] = object[propertyName] ? object[propertyName] : '';
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
