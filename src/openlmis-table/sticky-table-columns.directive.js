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
     *         <th class="col-sticky">Number</th>
     *         <th >Name</th>
     *       </tr>
     *     </thead>
     *     <tbody>
     *       <tr><td >123</td><td >Foo</td></tr>
     *       <tr><td >456</td><td>Bar</td></tr>
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

            var parent,
                // Values used by cells to calculate offset...
                parentWidth,
                tableWidth,
                leftEdge,
                rightEdge,
                currentLeftOffset,
                currentRightOffset,
                currentParent;

            scope.$watch(function() {
                return element[0].querySelectorAll('.col-sticky').length;
            }, updateStickyElementsDelayed);

            scope.$watch(function() {
                return element[0].querySelectorAll('td').length;
            }, updateStickyElementsDelayed);

            // If the window changes sizes, update the view
            angular.element($window).bind('resize', updateStickyElementsDelayed);

            scope.$on('$destroy', function() {
                angular.element($window).unbind('resize', updateStickyElementsDelayed);
                parent.off('scroll', blit);
                parent = undefined;
            });

            var updateTimeout;
            function updateStickyElementsDelayed() {
                if(updateTimeout) {
                    $timeout.cancel(updateTimeout);
                }
                updateTimeout = $timeout(sendUpdateEvent, 100);
            }


            var scrollLeftOffset;
            function updateScrollPosition() {
                scrollLeftOffset = element.position().left;
                animate();
            }

            var animationLoopId;
            function animate() {
                if(animationLoopId) {
                    window.cancelAnimationFrame(animationLoopId);
                }
                animationLoopId = window.requestAnimationFrame(blit);
            }

            scope.$on('$destroy', function(){
                if(animationLoopId) {
                    window.cancelAnimationFrame(animationLoopId);
                }
            });

            function sendUpdateEvent() {
                element.trigger('openlmis-table.reset');
            }

            /**
             * @ngdoc method
             * @name updateStickyElements
             * @methodOf openlmis-table.directive:stickyTableColumns
             *
             * @description
             * Figures out which columns are stick, and organizes the cells in
             * the the sticky columns to be easy to animate.
             *
             * This function is responsible for updating the sticky columns as
             * the user scrolls.
             */
            element.on('openlmis-table.reset', updateStickyElements);

            var stickyColumns;
            function updateStickyElements() {
                // Remove all the classes so calculation function is "clean"
                jQuery('.stuck', element)
                .removeClass('stuck stuck-right stuck-left')
                .css('left', '0px');

                if(parent) {
                    parent.off('scroll', updateScrollPosition);
                }

                parent = element.parent(); // reset in case it changed...
                parent.on('scroll', updateScrollPosition);

                createStickColumns();
                updateScrollPosition();
                animate(); // Remove
            }

            function createStickColumns() {
                stickyColumns = [];

                // Create blit functions
                element.find('thead tr:last .col-sticky').each(function(index, cell) {
                    var column = {};

                    cell = angular.element(cell);

                    column.index = cell.parent().children().index(cell).toString();
                    column.blit = setUpBlits(cell);

                    stickyColumns.push(column);
                });

                element.find('th, td').each(function(index, cell) {
                    cell = angular.element(cell);

                    if(cell.parents('tr.title').length > 0) {
                        return ;
                    }
                    
                    var cellIndex = 0;
                    cell.prevAll().each(function(index, el){
                        if(el.getAttribute('colspan')) {
                            cellIndex += parseInt(el.getAttribute('colspan'));
                        } else {
                            cellIndex += 1;
                        }
                    });


                    stickyColumns.forEach(function(column){
                        if(cellIndex.toString() === column.index) {
                            if(!column.cells) {
                                column.cells = cell;
                            } else {
                                column.cells = column.cells.add(cell);
                            }
                        }
                    });
                });
            }

            /**
             * @ngdoc method
             * @name blit
             * @methodOf openlmis-table.directive:stickyTableColumns
             *
             * @description
             * Updates the position of all the sticky columns in the table.
             * This function caches the last position it was updated for to
             * ensure that the DOM is not needlessly updated.
             */
            var lastPositionUpdate;
            element.on('openlmis-table.reset', function() {
                lastPositionUpdate = undefined;
            });
            function blit() {
                if(lastPositionUpdate === undefined || lastPositionUpdate !== scrollLeftOffset) {
                    lastPositionUpdate = scrollLeftOffset;

                    calculateViewableArea();
                    resetCurrent();
                    updateColumns();
                }
            }

            function calculateViewableArea() {
                tableWidth = element.width();
                parentWidth = element.parent().width();

                leftEdge = 0 - element.position().left;
                rightEdge = parentWidth + leftEdge;
            }

            function resetCurrent(parent){
                currentParent = parent;
                currentLeftOffset = 0;
                currentRightOffset = 0;
            }

            function updateColumns() {
                angular.forEach(stickyColumns, function(column) {
                    var position = column.blit();

                    if(column.offset === position) {
                        return;
                    }
                    column.offset = position;

                    column.cells.css('transform', 'translate3d(' + position + 'px, 0px, 0px)');

                    if(position > 0) {
                        column.cells.addClass('stuck stuck-left');
                        column.cells.removeClass('stuck-right');
                    } else if(position < 0) {
                        column.cells.addClass('stuck stuck-right');
                        column.cells.removeClass('stuck-left');
                    } else {
                        column.cells.removeClass('stuck stuck-left stuck-right');
                    }
                });
            }

            /**
             * @ngdoc method
             * @name setUpBlits
             * @methodOf openlmis-table.directive:stickyTableColumns
             *
             * @param {Object} cell HTML element representation from jQuery
             * 
             * @description
             * Creates a function to measure where the current cell should be
             * positioned. The initial cell position is calculated when the
             * blit is first set up to keep the animation performant.
             *
             * This function just does calculations and no manipulation to
             * prevent DOM reflows.
             */
            function setUpBlits(cell) {
                var cellOffset = cell.position().left,
                    cellWidth = cell.outerWidth(),
                    cellParent = cell.parent()[0];

                return function() {
                    var position = 0;

                    if(currentParent != cellParent) {
                        resetCurrent(cellParent);
                    }

                    if(cell.hasClass('sticky-right') && canFit()) {
                        position = rightBlit();
                    } else if(canFit()) {
                        position = leftBlit();
                    }

                    return position;
                };

                function canFit() {
                    return currentLeftOffset + currentRightOffset + cellWidth < parentWidth;
                }

                function leftBlit() {
                    var position = leftEdge;
                    // if offset, cell will break table
                    if(position + cellWidth > tableWidth) {
                        return 0;
                    }

                    currentLeftOffset += cellWidth;
                    return position;
                }

                function rightBlit() {
                    var position = 0 - (tableWidth - parentWidth - leftEdge);
                    // if offset, this will run off screen
                    if(position >= 0) {
                        return 0;
                    }

                    currentRightOffset += cellWidth;
                    return position;
                }
            }

        }
    }

})();
