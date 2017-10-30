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
     * @ngdoc directive
     * @restrict C
     * @name openlmis-table.directive:openlmisTablePane
     *
     * @description
     * Creates a virtualized table pane that renders a minimal number of rows to the screen
     *
     * @example
     * ```
     * <div class="openlmis-table-pane">
     *     <table>
     *         <div class="toolbar"></div>
     *     </table>
     * <div>
     * ```
     */
    angular
        .module('openlmis-table')
        .directive('openlmisTablePane', directive)
        .controller('OpenlmisExampleTableData', controller);

    function controller() {
        this.rows = [];
        this.columns = [];

        this.setRows = function(num) {
            var i = 0;
            this.rows = [];
            for(i;i<num;i++) {
                this.rows.push({});
            }
        }

        this.setColumns = function(num) {
            var i = 0;
            this.columns = [];
            for(i;i<num;i++) {
                this.columns.push(i);
            }
        }

        this.makeTotal = function(row) {
            var total = 0;
            this.columns.forEach(function(column) {
                if(row[column]) {
                    total += parseInt(row[column]);
                }
            });
            return total;
        }

        this.totalRows = function() {
            var total = 0;
            this.rows.forEach(function(row) {
                total += this.makeTotal(row);
            });
            return total;
        }

        this.update = function(rows, cols) {
            this.setRows(rows);
            this.setColumns(cols);
        }

        this.setRows(2000);
        this.setColumns(35);
    }

    directive.$inject = ['$compile', '$timeout'];

    function directive($compile, $timeout) {
        var directive = {
            compile: compile,
            restrict: 'C',
            priority: 10
        };
        return directive;

        function compile(element, attrs) {
            var table = element.find('table');
            setup(element, table);

            return function(scope, element, attrs) {

            };
        }

        function setup(container, table) {
            var thead = table.find('thead').clone().prependTo(container).wrap('<table role="presentation" aria-hidden>'),
                tfoot = table.find('tfoot').clone().appendTo(container).wrap('<table role="presentation" aria-hidden>');

            table.wrap('<md-virtual-repeat-container></md-virtual-repeat-container>');

            var repeatRow = container.find('tbody tr');
            repeatRow.attr('md-virtual-repeat', repeatRow.attr('ng-repeat'));
            repeatRow.removeAttr('ng-repeat');
        }
    }

})();
