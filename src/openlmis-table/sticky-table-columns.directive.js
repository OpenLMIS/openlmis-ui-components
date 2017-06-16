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
     * @name openlmis-table.directive:stickyTableColumns
     *
     * @description
     * Allows the user to stick a table heading or table cell element by adding the class
     * sticky to the element. This will automatically stick the element to the left or
     * right side of the table using relative positioning.
     *
     * Only tables that are surrounded by a `.table-container` class will have sticky columns.
     *
     * @example
     * ```
     * <div class="openlmis-table-container">
     *   <table >
     *     <thead>
     *       <tr>
     *         <th class="sticky">Number</th>
     *         <th >Name</th>
     *       </tr>
     *     </thead>
     *     <tbody>
     *       <tr><td class="sticky">123</td><td >Foo</td></tr>
     *       <tr><td class="sticky">456</td><td>Bar</td></tr>
     *     </tbody>
     *   </table>
     * </div>
     * ```
     */
    angular
        .module('openlmis-table')
        .directive('table', directive);

    directive.$inject = ['$window', '$timeout', 'jQuery'];
    function directive($window, $timeout, jQuery) {

        return {
            restrict: 'E',
            priority: 11,
            link: link
        };

        function link(scope, element, attrs) {
            // Only check for sticky elements if within a table container
            if(element.parents('.openlmis-table-container').length === 0) {
                return ;
            }

            var parent = element.parent(),
            // Values used by cells to calculate offset...
            parentWidth,
            tableWidth,
            leftEdge,
            rightEdge,
            currentLeftOffset,
            currentRightOffset,
            currentParent,
            columnIndexes = {},
            blits = []; // functions that update cell position

            // Updates blit array...
            updateStickyElements();

            scope.$watch(function() {
                return element[0].querySelectorAll('.col-sticky').length;
            }, updateStickyElementsDelayed);

            scope.$watch(function() {
                return element[0].querySelectorAll('td').length;
            }, updateStickyElementsDelayed);

            var updateTimeout,
                blitInProgress = false;

            function updateStickyElementsDelayed() {
                if(updateTimeout) {
                    $timeout.cancel(updateTimeout);
                }
                updateTimeout = $timeout(updateStickyElements, 100);
            }

            // If the window changes sizes, update the view
            angular.element($window).bind('resize', function() {
                blit();
                $timeout(blit);
            });

            element.on('$destroy', function() {
                angular.element($window).unbind('resize', updateStickyElements);
                parent.off('scroll', blit);
                parent = undefined;
            });

            /**
             * @ngdoc method
             * @name updateStickyElements
             * @methodOf openlmis-table.directive:stickyTableColumns
             *
             * @description
             * Updates the functions that animate each sticky element.
             */
            function updateStickyElements() {
                blits = [];

                if(parent) {
                    parent.off('scroll', blit);
                }

                parent = element.parent(); // reset in case it changed...
                parent.on('scroll', blit);

                // Create blit functions
                jQuery('.col-sticky', element).each(function(index, cell) {
                    cell = angular.element(cell);

                    var parent = cell.parent();
                    var cellIndex = parent.children().index(cell);

                    columnIndexes[cellIndex] = cell;

                    setUpBlits(cell);
                });

                blit();
            }

            /**
             * @ngdoc method
             * @name blit
             * @methodOf openlmis-table.directive:stickyTableColumns
             *
             * @description
             * Updates view items, and animates cells
             */
            function blit() {
                tableWidth = element.width();
                parentWidth = element.parent().width();

                leftEdge = 0 - element.position().left;
                rightEdge = parentWidth + leftEdge;

                // Always remove all the classes before bliting
                jQuery('.stuck', element)
                .removeClass('stuck')
                .removeClass('stuck-right')
                .removeClass('stuck-left')
                .css('left', '0px');

                resetCurrent();

                angular.forEach(blits, function(blit) {
                    blit();
                });

                var stickyColumnIndexes = Object.keys(columnIndexes);

                jQuery('td', element).each(function(index, td) {
                    if(td.getAttribute('colspan')) {
                        return;
                    }
                    td = angular.element(td);
                    var tdParent = td.parent();
                    var tdIndex = tdParent.children().index(td).toString();
                    if(stickyColumnIndexes.indexOf(tdIndex) < 0) {
                        return;
                    }

                    var columnCell = columnIndexes[tdIndex];
                    if(columnCell.hasClass('stuck')){
                        td.addClass('stuck');
                    }
                    if(columnCell.hasClass('stuck-left')){
                        td.addClass('stuck-left');
                    }
                    if(columnCell.hasClass('stuck-right')){
                        td.addClass('stuck-right');
                    }
                    td.css('left', columnCell.css('left'));
                });
            }

            function resetCurrent(parent){
                currentParent = parent;
                currentLeftOffset = 0;
                currentRightOffset = 0;
            }

            /**
             * @ngdoc method
             * @name setUpLeftBlit
             * @methodOf openlmis-table.directive:stickyTableColumns
             *
             * @description
             * Create an animation function to position an element to the left.
             */
            function setUpBlits(cell) {
                var cellOffset = cell.position().left,
                cellWidth = cell.outerWidth(),
                cellParent = cell.parent()[0];

                blits.push(function(){
                    if(cell.hasClass('stuck')) {
                        return;
                    }

                    if(currentParent != cellParent) {
                        resetCurrent(cellParent);
                    }

                    var canFit = currentLeftOffset + currentRightOffset + cellWidth < parentWidth;

                    if(cell.hasClass('sticky-right') && canFit) {
                        rightBlit();
                    } else if(canFit) {
                        leftBlit();
                    } else {
                        setPosition(0);
                    }
                });

                function leftBlit() {
                    var position = leftEdge;
                    // if offset, cell will break table
                    if(position + cellWidth > tableWidth) {
                        return ;
                    }

                    setPosition(position);
                    cell.addClass('stuck');
                    cell.addClass('stuck-left');
                    currentLeftOffset += cellWidth;
                }

                function rightBlit() {
                    var position = 0 - (tableWidth - parentWidth - leftEdge);
                    // if offset, this will run off screen
                    if(position >= 0) {
                        return;
                    }

                    setPosition(position);
                    cell.addClass('stuck');
                    cell.addClass('stuck-right');
                    currentRightOffset += cellWidth;
                }

                function setPosition(position) {
                    cell.css('left', position + 'px');
                }
            }

        }
    }

})();
