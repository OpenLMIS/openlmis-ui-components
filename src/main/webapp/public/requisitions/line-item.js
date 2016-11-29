(function() {

    'use strict';

    angular
    .module('openlmis.requisitions')
    .factory('LineItem', lineItem);

    lineItem.$inject = ['validations', 'calculations', 'Columns', 'Source'];

    function lineItem(validations, calculations, Columns, Source) {

        LineItem.prototype.getFieldValue = getFieldValue;
        LineItem.prototype.updateFieldValue = updateFieldValue;

        return LineItem;

        function LineItem(lineItem, requisition) {
            var newLineItem = this,
            programId = requisition.program.id;

            angular.merge(newLineItem, lineItem);
            newLineItem.$errors = {};
            newLineItem.$program = getProgramById(lineItem.orderableProduct.programs, programId);

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
            if (column.source === Source.CALCULATED) {
                var name = column.name;
                this[name] = calculations[name](this, status);
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

    };

})();
