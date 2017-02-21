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
