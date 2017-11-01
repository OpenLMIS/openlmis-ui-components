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

        this.setRows(2000);
        this.setColumns(30);
    }

    directive.$inject = ['$$rAF', '$compile', '$timeout'];

    function directive($$rAF, $compile, $timeout) {
        var directive = {
            compile: compile,
            restrict: 'C',
            priority: 10,
            controller: controller,
            require: 'openlmisTablePane'
        };
        return directive;

        function controller() {
            var elements = [],
                tableRectangle = {},
                viewportRectangle = {};

            this.registerStickyCell = registerStickyCell;
            this.unregisterStickyCell = unregisterStickyCell;

            this.updateViewportSize = updateViewportSize;
            this.updateViewportPosition = updateViewportPosition;
            this.updateTableSize = updateTableSize;

            this.updateElements = updateElements;


            function registerStickyCell(cellCtrl) {
                elements.push(cellCtrl);
            };

            
            function unregisterStickyCell(cellCtrl) {
                elements = _.without(elements, cellCtrl);
            };

            
            function updateViewportPosition(top, left) {
                _.extend(viewportRectangle, {
                    top: top,
                    left: left
                });
                this.updateElements();
            }

            function updateViewportSize(width, height) {
                _.extend(viewportRectangle, {
                    width: width,
                    height: height
                });
                this.updateElements();
            }

            function updateTableSize(width, height) {
                _.extend(tableRectangle, {
                    width: width,
                    height: height
                });
                this.updateElements();
            }

            function updateElements() {
                elements.forEach(function(cell) {
                    cell.updatePosition(viewportRectangle, tableRectangle);
                });
            }
        }

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
            setupVirtualRepeat(element, table);
            setupStickyCells(table);
            return link;
        }

        function link(scope, element, attrs, ctrl) {
            var debounceTime = 50;

            var viewportObserver = new ResizeObserver(_.debounce(function(entities, observer) {
                var rect = entities[0].contentRect;
                ctrl.updateViewportSize(rect.width, rect.height);
            }, debounceTime));
            viewportObserver.observe(element[0]);

            var tableObserver = new ResizeObserver(_.debounce(function(entities, observer) {
                var rect = entities[0].contentRect;
                ctrl.updateTableSize(rect.width, rect.height);
            }, debounceTime));
            tableObserver.observe(element.find('table')[0]);

            var scrollContainer = element.find('.md-virtual-repeat-scroller');

            PerfectScrollbar.initialize(scrollContainer[0], {
                suppressScrollY: false,
                suppressScrollX: false
            });

            var mdVirtualRepeatCtrl = element.find('.md-virtual-repeat-container').controller('mdVirtualRepeatContainer');

            var throttled = _.throttle(function(event) {
                var offseterValue,
                    scrollOffset = mdVirtualRepeatCtrl.scrollOffset;

                try {
                    offseterValue = parseInt(mdVirtualRepeatCtrl.offsetter.style.transform.split('(')[1].split('px')[0]);
                } catch(e) {
                    offseterValue = 0;
                }

                ctrl.updateViewportPosition(scrollOffset - offseterValue, event.target.scrollLeft);
            }, debounceTime);
            scrollContainer.on('scroll', throttled);
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
        function setupVirtualRepeat(container, table) {
            table.wrap('<md-virtual-repeat-container></md-virtual-repeat-container>');

            var repeatRow = container.find('tbody tr');
            repeatRow.attr('md-virtual-repeat', repeatRow.attr('ng-repeat'));
            repeatRow.removeAttr('ng-repeat');
        }

        function setupStickyCells(table) {
            table.find('thead').find('th, td').each(function(index, cell) {
                cell.setAttribute('openlmis-table-sticky-cell', "");
                cell.setAttribute('openlmis-sticky-top', "");
            });
            table.find('tfoot').find('th, td').each(function(index, cell) {
                cell.setAttribute('openlmis-table-sticky-cell', "");
                cell.setAttribute('openlmis-sticky-bottom', "");
            });
            table.find('.col-sticky').each(function(index, cell) {
                cell.setAttribute('openlmis-table-sticky-cell', "");
                cell.setAttribute('openlmis-sticky-column', "");
            });
            table.find('.col-sticky.col-sticky-right').each(function(index, cell) {
                cell.setAttribute('openlmis-table-sticky-cell', "");
                cell.setAttribute('openlmis-sticky-column', "");
                cell.setAttribute('openlmis-sticky-column-right', "");
            });
        }

    }

})();
