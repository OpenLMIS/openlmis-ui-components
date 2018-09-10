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
     * @restrict E
     * @name openlmis-table.directive:tableTDFocus
     *
     * @description
     * Makes sure the table cell element is focused.
     */

    angular
        .module('openlmis-table')
        .directive('table', directive);

    directive.$inject = ['$timeout', '$window'];

    function directive($timeout, $window) {
        return {
            link: link,
            restrict: 'E'
        };

        function link(scope, element, attrs) {
            if (!element.parents('.openlmis-table-container').length) {
                return;
            }

            element.on('focus focusin', 'td, th', checkVisibilityDeferred);
            element.on('blur focusout', 'td, th', cancelVisibilityDeferred);

            scope.$on('$destroy', function() {
                element.off('focus focusin', 'td, th', checkVisibilityDeferred);
                element.off('blur focusout', 'td, th', cancelVisibilityDeferred);
            });

            /**
             * @ngdoc method
             * @name checkVisibilityDeferred
             * @methodOf openlmis-table.directive:tableTDFocus
             *
             * @param {Event} event A DOM focus event
             *
             * @description
             * Defers the action from the focus/focusin events so that multiple
             * events don't execute twice.
             */
            var checkVisibilityTimeout;
            function checkVisibilityDeferred(event) {
                cancelVisibilityDeferred();

                checkVisibilityTimeout = $timeout(function() {
                    checkVisibility(getTableCell(event));
                }, 100);
            }

            /**
             * @ngdoc method
             * @name cancelVisibilityDeferred
             * @methodOf openlmis-table.directive:tableTDFocus
             *
             * @description
             * Cancel's checking visiblity, and is called if the table cell
             * loses focus.
             */
            function cancelVisibilityDeferred() {
                if (checkVisibilityTimeout) {
                    $timeout.cancel(checkVisibilityTimeout);
                }
            }

            /**
             * @ngdoc method
             * @name getTableCell
             * @methodOf openlmis-table.directive:tableTDFocus
             *
             * @param {Event} event A DOM focus event
             *
             * @return {Object} jQuery object for a table cell
             *
             * @description
             * Checks the event's target and returns the containing table cell
             * if the event target isn't a table cell.
             */
            function getTableCell(event) {
                var nodeName = event.target.nodeName.toLowerCase();
                if (nodeName === 'td' || nodeName === 'th') {
                    return angular.element(event.target);
                }
                return angular.element(event.target)
                    .parents('td, th')
                    .first();

            }

            /**
             * @ngdoc method
             * @name getVisibleTableArea
             * @methodOf openlmis-table.directive:tableTDFocus
             *
             * @return {Object} Object with dimensions for the visible area
             *
             * @description
             * Returns the visible area of the table.
             */
            function getVisibleTableArea() {
                var visibleEdgeLeft = 0,
                    visibleEdgeRight = 0,
                    leftOffset = element.parent()[0].scrollLeft;

                if (attrs.leftEdge) {
                    visibleEdgeLeft = attrs.leftEdge;
                }
                if (attrs.rightEdge) {
                    visibleEdgeRight = attrs.rightEdge;
                }

                return {
                    leftEdge: visibleEdgeLeft,
                    rightEdge: visibleEdgeRight,
                    leftOffset: leftOffset
                };
            }

            /**
             * @ngdoc method
             * @name checkVisibility
             * @methodOf openlmis-table.directive:tableTDFocus
             *
             * @param {Object} tableCell A table cell DOM element
             *
             * @description
             * Check to see if the table cell is entirely inside the table
             * element, otherwise the table is scrolled.
             */
            function checkVisibility(tableCell) {
                if (tableCell.length !== 1) {
                    return;
                }

                if (tableCell.hasClass('stuck')) {
                    return;
                }

                var visibleArea = getVisibleTableArea(),
                    leftEdge = tableCell.position().left,
                    width = tableCell.outerWidth(),
                    rightEdge = visibleArea.leftOffset + leftEdge + width;

                if (leftEdge < visibleArea.leftEdge || rightEdge > visibleArea.rightEdge) {
                    scrollTable(visibleArea.leftOffset + leftEdge - visibleArea.leftEdge);
                }
            }

            /**
             * @ngdoc method
             * @name scrollTable
             * @methodOf openlmis-table.directive:tableTDFocus
             *
             * @param {Number} pos The position to scroll the table to
             *
             * @return {Object} jQuery object for a table cell
             *
             * @description
             * Scrolls the table *instantly* when the next animationFrame is
             * called.
             */
            function scrollTable(pos) {
                $window.requestAnimationFrame(function() {
                    element.parent()[0].scrollLeft = pos;
                });
            }
        }

    }

})();
