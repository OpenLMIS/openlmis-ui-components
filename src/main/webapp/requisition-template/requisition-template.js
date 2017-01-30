(function() {

    'use strict';

    /**
     * @ngdoc object
     * @name requisition-template.RequisitionTemplate
     *
     * @description
     * Represents a template of a single requisition. Provides methods for retrieving columns.
     */
    angular
        .module('requisition-template')
        .factory('RequisitionTemplate', template);

    template.$inject = ['RequisitionColumn', '$filter'];

    function template(RequisitionColumn, $filter) {

        RequisitionTemplate.prototype.getColumns = getColumns;
        RequisitionTemplate.prototype.getColumn = getColumn;

        return RequisitionTemplate;

        function RequisitionTemplate(template, requisition) {
            angular.copy(template, this);

            var columnsMap = {};
            angular.forEach(template.columnsMap, function(column) {
                columnsMap[column.name] = new RequisitionColumn(column, requisition);
            });
            this.columnsMap = columnsMap;
        }

        function getColumns(nonFullSupply) {
            var columns = [];
            angular.forEach(this.columnsMap, function(column) {
                if (column.$display && (!nonFullSupply || !column.$fullSupplyOnly)) {
                    columns.push(column);
                }
            });
            return columns;
        }

        /**
         * @ngdoc method
         * @methodOf requisition-template.RequisitionTemplate
         * @name getColumn
         *
         * @description
         * Retrieves a column with the given name. If it doesn't exist undefined will be returned.
         *
         * @param   {String}    name    the name of the column
         * @return  {Object}            the matching column
         */
        function getColumn(name) {
            return this.columnsMap[name];
        }
    }

})();
