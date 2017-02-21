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
     * @restrict 'E'
     * @name openlmis-table.directive:stickyTableColumns
     *
     * @description
     * Allows the user to stick a table heading or table cell element by adding the class
     * sticky to the element. This will automatically stick the element to the left or
     * right side of the table using relative positioning.
     *
     * Only tables that are surrouned by a `.table-container` class will have sticky columns.
     *
     * @example
     * ```
     * <div class="table-container">
     *   <table >
     *     <thead>
     *       <tr>
     *         <th class="sticky">Number</th>
     *         <th >Name</th>
     *       </tr>
     *     </thead>
     *     <tbody title="Category Title">
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

    directive.$inject = ['$window', '$timeout'];
    function directive($window, $timeout) {

        return {
            restrict: 'E',
            link: link
        };

        function link(scope, element, attrs) {
            // Only check for sticky elements if within a table container
            if(element.parents('.openlmis-table-container').length == 0){
                return ;
            }

            var parent = element.parent(),
            // Values used by cells to calculate offset...
            parentWidth,
            tableWidth,
            leftEdge,
            rightEdge,
            blits = []; // functions that update cell position

            // Updates blit array...
            parent.on('scroll', blit);
            updateStickyElements();

            // If there are new items added to the grid, redraw
            scope.$watch(function(){
                return element[0].querySelectorAll('.sticky:not(.sticky-added)').length;
            }, updateStickyElements);
            // If the window changes sizes, update the view
            angular.element($window).bind('resize', updateStickyElements);

            element.on('$destroy', function() {
                angular.element($window).unbind('resize', updateStickyElements);
                parent = undefined;
            });

            /**
             * @ngdoc function
             * @name updateStickyElements
             * @methodOf openlmis-table.directive:stickyTableColumns
             *
             * @description
             * Updates the functions that animate each sticky element.
             *
             */
            function updateStickyElements(){
                blits = [];

                // Reset DOM Elements
                var stuckElements = element[0].querySelectorAll('.sticky-added');
                angular.forEach(stuckElements, function(cell){
                    angular.element(cell).removeClass('sticky-added');
                });

                // Create blit functions
                var pinnedCellsQuery = element[0].querySelectorAll('.sticky');
                angular.forEach(pinnedCellsQuery, function(cell) {
                    cell = angular.element(cell);
                    cell.addClass('sticky-added');
                    blits.push(setUpCell(cell));
                });

                // Create blits functions for pagination control
                var paginationDivsQuery = parent[0].querySelectorAll('.openlmis-pagination');
                angular.forEach(paginationDivsQuery, function(div) {
                    div = angular.element(div);
                    div.addClass('sticky-added');
                    blits.push(setUpCell(div));
                })

                blit();
            }

            /**
             * @ngdoc function
             * @name blit
             * @methodOf openlmis-table.directive:stickyTableColumns
             *
             * @description
             * Updates view items, and animates cells
             *
             */
            function blit(){
                parentWidth = parent.width();
                tableWidth = element.width();

                var offset = 0 - element.position().left;

                leftEdge = offset;
                rightEdge = parentWidth + offset;

                angular.forEach(blits, function(blit){
                    blit(offset);
                });
            }

            /**
             * @ngdoc function
             * @name setUpCell
             * @methodOf openlmis-table.directive:stickyTableColumns
             *
             * @description
             * Creates set of functions for element that updates items
             *
             */
            function setUpCell(cell){
                var cellOffset = cell.position().left;
                var cellWidth = cell.width();

                return blitCell;

                /**
                 * @ngdoc function
                 * @name blitCell
                 * @methodOf openlmis-table.directive:stickyTableColumns
                 *
                 * @description
                 * Calculation and manipulation of position for each cell
                 *
                 */
                function blitCell(offset){
                    if(rightEdge - tableWidth > 0){
                        return; // if the end of the table has been reached, stop
                    }

                    var leftOffset = 0;
                    angular.forEach(
                        cell.parent().children('.stuck-left'),
                        function(sibling){
                            leftOffset += angular.element(sibling).outerWidth();
                        });

                    var rightOffset = 0;
                    angular.forEach(
                        cell.parent().children('.stuck-right'),
                        function(sibling){
                            rightOffset += angular.element(sibling).outerWidth();
                        });

                    if(cellOffset + cellWidth > rightEdge - rightOffset){ // if the column is far away on the right...
                        setPosition(rightEdge - tableWidth);
                        cell.addClass('stuck');
                        cell.addClass('stuck-right');
                    } else if(cellOffset < leftEdge + leftOffset) {
                        setPosition(leftEdge);
                        cell.addClass('stuck');
                        cell.addClass('stuck-left');
                    } else {
                        setPosition(0);
                        cell.removeClass('stuck');
                        cell.removeClass('stuck-left');
                        cell.removeClass('stuck-right');
                    }
                }

                /**
                 * @ngdoc function
                 * @name setPosition
                 * @methodOf openlmis-table.directive:stickyTableColumns
                 *
                 * @description
                 * Updates an element's relative position, but should used transform to take
                 * advantage of simpler rendering. See the following article for an explination
                 * of what and why we would like to achieve this.
                 * https://www.kirupa.com/html5/animating_movement_smoothly_using_css.htm
                 *
                 */
                function setPosition(position){
                    cell.css('left', position + 'px');
                }
            }

        }
    }

})();
