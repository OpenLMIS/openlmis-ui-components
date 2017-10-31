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
     * The OpenLMIS table pane rearranges a table, so that it can be used even
     * when the content of the table is extremely large.
     *
     * To keep browser frame rates high, this directive implements the AngularJS
     * Material virtualRepeat directive. This means that like the virtualRepeat
     * directive, the ng-repeat attribute can only match statemeants formatted
     * like "item in items".
     *
     * Scrollbars are applied dynamically to this layout, as it is mean to make
     * the table element be the only scrollable elemnt on the page.
     * 
     * Additionally, the directive statically places header and footers so they
     * are not animated.
     *
     * @example
     * ```
     * <div class="openlmis-table-pane">
     *     <table>
     *         <tbody>
     *             <tr ng-repeat="item in items">
     *                 <td>Example</td>
     *             </tr>
     *          </tbody>
     *     </table>
     * <div>
     * ```
     */
    angular
        .module('openlmis-table')
        .directive('openlmisTablePane', directive)
        .controller('OpenlmisExampleTableData', controller);

    // IGNORE THIS CONTROLLER, it will be removed
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

    directive.$inject = ['$$rAF', '$compile', '$timeout'];

    function directive($$rAF, $compile, $timeout) {
        var directive = {
            compile: compile,
            restrict: 'C',
            priority: 10
        };
        return directive;

        /**
         * @ngdoc method
         * @name  compile
         * @methodOf openlmis-table.directive:openlmisTablePane
         *
         * @param {Object} element openlmisTablePane element
         *
         * @description
         * When the directive is compiled the setup method is run. 
         * 
         * In the post-link phase of the directive a ResizeObserver is created to
         * watch if the table changes in size, which will trigger other layout
         * functions.
         *
         * Additionally, the ResizeObserver recalculates table column widths.
         *
         * PerfectScrollbar elements are added in this phase. 
         */
        function compile(element) {
            var table = element.find('table');
            setup(element, table);

            return function(scope, element, attrs) {
                var observer = new ResizeObserver(_.debounce(function(entities, observer) {
                    setContainerWidth(element, entities[0].contentRect.width);
                    udpateColumnWidths(element);
                }, 250));

                observer.observe(element.find('tbody')[0]);

                PerfectScrollbar.initialize(element[0], {
                    suppressScrollY: true
                });
            };
        }

        /**
         * @ngdoc method
         * @name  setup
         * @methodOf openlmis-table.directive:openlmisTablePane
         *
         * @param {Object} container openlmisTablePane element
         * @param {Object} table     Original table element placed on page
         *
         * @description
         * Sets up the layout of virtualRepeat elements and table headers/footers
         * that are used to make the design performant. 
         */
        function setup(container, table) {
            var thead = table.find('thead').clone().prependTo(container).wrap('<table class="thead" tab-index="-1" role="presentation" aria-hidden>'),
                tfoot = table.find('tfoot').clone().appendTo(container).wrap('<table class="tfoot" tab-index="-1" role="presentation" aria-hidden>');

            table.wrap('<md-virtual-repeat-container></md-virtual-repeat-container>');

            var repeatRow = container.find('tbody tr');
            repeatRow.attr('md-virtual-repeat', repeatRow.attr('ng-repeat'));
            repeatRow.removeAttr('ng-repeat');
        }

        /**
         * @ngdoc method
         * @name  setContainerWidth
         * @methodOf openlmis-table.directive:openlmisTablePane
         *
         * @param {Object} element openlmisTablePane element
         * @param {Number} width   New width of the table element
         *
         * @description
         * When the table is resized, this updates the virtualRepeat container
         * making the full width of the table visible -- otherwise the table will
         * but visually cut off.
         */
        function setContainerWidth(element, width) {
            $$rAF(function() {
                element.find('.md-virtual-repeat-container').width(width);
            });
        }

        /**
         * @ngdoc method
         * @name  updateColumnWidths
         * @methodOf openlmis-table.directive:openlmisTablePane
         *
         * @param {Object} element openlmisTablePane element
         *
         * @description
         * In the setup function, the thead and tfoot elements are copied so they
         * are always visible. They are copied in such a way that their width
         * doesn't change with the rest of the table. This function makes sure
         * the visible thead and tfoot sections always align with the table body. 
         */
        function udpateColumnWidths(element) {
            var columnWidths = [];
            element.find('tbody tr:first').find('td,th').each(function(index, cell) {
                columnWidths[index] = angular.element(cell).outerWidth();
            });
            $$rAF(function() {
                element.children('table').find('tr:last').each(function(_index, row) {
                    angular.element(row).find('th, td').each(function(index, cell) {
                        angular.element(cell).css('min-width', columnWidths[index] + 'px');
                    });
                });
            });
        }
    }

})();
