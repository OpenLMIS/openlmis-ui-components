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
     * The OpenLMIS table pane adds elements to make extremely large tables
     * performant and usable.This is done by adding the AngularJS Material
     * virtualRepeat directive, which renders only visible elements to the
     * screen.
     *
     * This element changes the page's layout, and adds an internal scroll to
     * on the element. The table within the table pane will not scroll with the
     * rest of the document.
     *
     * *NOTE:* The virtualRepeat directive can only function with ng-repeat
     * statements that are formatted like "item in items"
     */
    angular
        .module('openlmis-table')
        .directive('openlmisTablePane', directive);

    directive.$inject = ['ResizeObserver'];

    function directive(ResizeObserver) {
        var directive = {
            compile: compile,
            restrict: 'C',
            priority: 10,
            controller: 'OpenlmisTablePaneController',
            require: 'openlmisTablePane'
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
         * Before the table element is rendered, the AngularJS Material
         * virtualRepeat directive, and sticky-cell directives are applied.
         */
        function compile(element) {
            var table = element.find('table');
            setupVirtualRepeat(element, table);
            setupStickyCells(table);
            return link;
        }

        /**
         * @ngdoc function
         * @name  link
         * @methodOf openlmis-table.directive:openlmisTablePane
         *
         * @param {Object} scope   AngularJS scope
         * @param {Object} element openlmisTablePane element
         * @param {Object} attrs   element attributes
         * @param {Object} ctrl    OpenlmisTablePaneController instance
         *
         * @description
         * Sets up scrollbars and runs functions to watch the size of the
         * element and it's scroll position.
         */
        function link(scope, element, attrs, ctrl) {
            var table = element.find('table'),
                scrollContainer = element.find('.md-virtual-repeat-scroller');

            $(scrollContainer[0]).perfectScrollbar();

            ctrl.setScrollLeft = function(num) {
                scrollContainer[0].scrollLeft = num;
            };

            watchSize(scope, ctrl, element, table);
            watchScroll(scope, ctrl, element);
        }

        /**
         * @ngdoc function
         * @name  watchScroll
         * @methodOf openlmis-table.directive:openlmisTablePane
         * 
         * @param  {Object} scope   [description]
         * @param  {Object} ctrl    [description]
         * @param  {Object} element [description]
         * @param  {Object} table   [description]
         *
         * @description
         * Registers a listener on the scrollable element within the table pane
         * which will update the OpenlmisTablePaneController's scroll position.
         *
         * This function will destroy the listener when the scope is destroyed.
         */
        function watchScroll(scope, ctrl, element) {
            var debounceTime = 50,
                scrollContainer = element.find('.md-virtual-repeat-scroller'),
                mdVirtualRepeatOfsetter = element.find('.md-virtual-repeat-offsetter'),
                throttled = _.throttle(updateViewportPositionOnScroll, debounceTime);

            scrollContainer.on('scroll', throttled);

            scope.$on('$destroy', function() {
                scrollContainer.off('scroll', throttled);
            });

            // Trigger scroll, so everything is rendered correctly on load
            scrollContainer.trigger('scroll');

            function updateViewportPositionOnScroll(event) {
                var offseterValue;

                try {
                    offseterValue = parseInt(mdVirtualRepeatOfsetter[0].style.transform.split('(')[1].split('px')[0]);
                } catch (e) {
                    offseterValue = 0;
                }

                ctrl.updateViewportPosition(event.currentTarget.scrollTop - offseterValue, event.target.scrollLeft);
            }
        }

        /**
         * @ngdoc function
         * @name  watchScroll
         * @methodOf openlmis-table.directive:openlmisTablePane
         * 
         * @param  {Object} scope   [description]
         * @param  {Object} ctrl    [description]
         * @param  {Object} element [description]
         * @param  {Object} table   [description]
         *
         * @description
         * Sets up listeners of resize events of the table pane element and the
         * table within the table pane. If either element changes size, that is
         * reported to the OpenlmisTablePaneController.
         *
         * This function will destroy the listener when the scope is destroyed.
         */
        function watchSize(scope, ctrl, element, table) {
            var debounceTime = 50,
                viewportObserver,
                tableObserver;

            viewportObserver = new ResizeObserver(_.debounce(function(entities) {
                var rect = entities[0].contentRect;
                ctrl.updateViewportSize(rect.width, rect.height);
            }, debounceTime));
            viewportObserver.observe(element[0]);

            tableObserver = new ResizeObserver(_.debounce(function(entities) {
                var rect = entities[0].contentRect;
                ctrl.updateTableSize(rect.width, rect.height);

                var offsetRight = 0,
                    offsetLeft = 0;
                table.find('tbody tr:first [openlmis-sticky-column]')
                    .each(function(index, cell) {
                        if (cell.hasAttribute('openlmis-sticky-column-right')) {
                            offsetRight += angular.element(cell)
                                .outerWidth();
                        } else {
                            offsetLeft += angular.element(cell)
                                .outerWidth();
                        }
                    });

                ctrl.updateViewportPadding(offsetLeft, offsetRight);

            }, debounceTime));
            tableObserver.observe(table[0]);

            scope.$on('$destroy', function() {
                viewportObserver.unobserve(element[0]);
                tableObserver.unobserve(table[0]);
            });
        }

        /**
         * @ngdoc method
         * @name  setupVirtualRepeat
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

        /**
         * @ngdoc method
         * @name  setupStickyCells
         * @methodOf openlmis-table.directive:openlmisTablePane
         *
         * @param {Object} table table element within openlmis-table-pane
         *
         * @description
         * Adds openlmis-table-sticky-cell directives to elements within the
         * table. 
         */
        function setupStickyCells(table) {
            table.find('thead')
                .find('th, td')
                .each(function(index, cell) {
                    cell.setAttribute('openlmis-table-sticky-cell', '');
                    cell.setAttribute('openlmis-sticky-top', '');
                });
            table.find('tfoot')
                .find('th, td')
                .each(function(index, cell) {
                    cell.setAttribute('openlmis-table-sticky-cell', '');
                    cell.setAttribute('openlmis-sticky-bottom', '');
                });
            table.find('.col-sticky')
                .each(function(index, cell) {
                    cell.setAttribute('openlmis-table-sticky-cell', '');
                    cell.setAttribute('openlmis-sticky-column', '');
                });
            table.find('.col-sticky.col-sticky-right')
                .each(function(index, cell) {
                    cell.setAttribute('openlmis-table-sticky-cell', '');
                    cell.setAttribute('openlmis-sticky-column', '');
                    cell.setAttribute('openlmis-sticky-column-right', '');
                });

            table.find('td,th')
                .each(function(index, cell) {
                    cell.setAttribute('openlmis-table-pane-cell-focusable', '');
                });

            table.find('.col-sticky')
                .removeClass('col-sticky')
                .removeClass('col-sticky-right');
        }

    }

})();
