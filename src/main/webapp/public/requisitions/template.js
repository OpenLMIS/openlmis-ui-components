(function() {

    'use strict';

    angular
        .module('openlmis.requisitions')
        .factory('Template', template);

    template.$inject = ['Column'];

    function template(Column) {

        Template.prototype.getColumns = getColumns;

        return Template;

        function Template(template, requisition) {
            this.showNonFullSupplyTab = requisition.program.showNonFullSupplyTab;

            var columns = [];
            angular.forEach(template.columnsMap, function(column) {
                columns.push(new Column(column, requisition));
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
