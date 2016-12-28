(function() {

    'use strict';

    angular
        .module('requisition-template')
        .factory('RequisitionTemplate', template);

    template.$inject = ['RequisitionColumn'];

    function template(RequisitionColumn) {

        RequisitionTemplate.prototype.getColumns = getColumns;

        return RequisitionTemplate;

        function RequisitionTemplate(template, requisition) {
            this.showNonFullSupplyTab = requisition.program.showNonFullSupplyTab;

            var columns = [];
            angular.forEach(template.columnsMap, function(column) {
                columns.push(new RequisitionColumn(column, requisition));
            });
            this.columns = columns;
        }

        function getColumns(nonFullSupply) {
            var columns = [];
            this.columns.forEach(function(column) {
                if (column.display && (!nonFullSupply || !column.fullSupplyOnly)) {
                    columns.push(column);
                }
            });
            return columns;
        }
    }

})();
