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
        this.setColumns(35);
    }

    angular.module('openlmis-table')
    .directive('openlmisTableStickyCell', otherDirective);

    otherDirective.$inject = ['$$rAF'];

    function otherDirective($$rAF) {
        return {
            restrict: 'A',
            controller: function() {
                this.rect = {};

                this.update = function(rect) {
                    _.extend(this.rect, rect);
                    this.animate();
                };

                this.animate = function() {};

            },
            require: ['openlmisTableStickyCell', '^^openlmisTablePane'],
            link: function(scope, element, attrs, ctrls) {
                var tablePaneCtrl = ctrls[1],
                    cellCtrl = ctrls[0];

                tablePaneCtrl.registerStickyCell(cellCtrl);

                var isStickyCol = element.hasClass('col-sticky'),
                    isStickyRight = element.hasClass('sticky-right'),
                    isStickyTop = element.parents('thead'),
                    isStickyBottom = element.parents('tfoot');

                cellCtrl.animate = function() {
                    var left = getLeftPos(),
                        top = getTopPos(),
                        transform = `translate3d(${left}px, ${top}px, 0px)`;

                    $$rAF(function() {
                        element[0].style.transform = transform;
                    });
                }

                function getLeftPos() {
                    if(isStickyCol) {
                        return cellCtrl.rect.left;
                    }
                    return 0;
                }

                function getTopPos() {
                    if(isStickyTop) {
                        return cellCtrl.rect.top;
                    }

                    if(isStickyBottom) {
                        return cellCtrl.rect.height - cellCtrl.rect.top
                    }

                    return 0;
                }

                scope.$on('$destroy', function() {
                    ctrl.removeStickyCell(cellCtrl);
                });
            }
        }
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
                rect = {};

            this.registerStickyCell = function(cell) {
                elements.push(cell);
            };
            this.removeStickyCell = function() {};

            this.updatePosition = function(top, left) {
                this.updateRect({
                    top: top,
                    left: left
                });
            }

            this.updateSize = function(width, height) {
                this.updateRect({
                    width: width,
                    height: height
                });
            }

            this.updateRect = function(newRect) {
                _.extend(rect, newRect);
                this.updateElements()
            }

            this.updateElements = function() {
                elements.forEach(function(cell) {
                    cell.update(rect);
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
            setup(element, table);

            table.find('thead, tfoot').find('th, td').each(function(index, cell) {
                cell.setAttribute('openlmis-table-sticky-cell', "");
            });

            return link;
        }

        function link(scope, element, attrs, ctrl) {
            var observer = new ResizeObserver(_.debounce(function(entities, observer) {
                var entity = entities[0];
                ctrl.updateSize(entity.contentRect.width, entity.contentRect.height);
            }, 250));

            observer.observe(element[0]);

            var scrollContainer = element.find('.md-virtual-repeat-scroller');

            PerfectScrollbar.initialize(scrollContainer[0], {
                suppressScrollY: false,
                suppressScrollX: false
            });

            var mdVirtualRepeatCtrl = element.find('.md-virtual-repeat-container').controller('mdVirtualRepeatContainer');

            var throttled = _.throttle(function(event) {
                var offseterValue = parseInt(mdVirtualRepeatCtrl.offsetter.style.transform.split('(')[1].split('px')[0]),
                    scrollOffset = mdVirtualRepeatCtrl.scrollOffset;
                ctrl.updatePosition(scrollOffset - offseterValue, event.target.scrollLeft);
            }, 100);
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
        function setup(container, table) {
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
                element.find('table.fixed').find('tr:last').each(function(_index, row) {
                    angular.element(row).find('th, td').each(function(index, cell) {
                        angular.element(cell).css('min-width', columnWidths[index] + 'px');
                    });
                });
            });
        }
    }

})();
